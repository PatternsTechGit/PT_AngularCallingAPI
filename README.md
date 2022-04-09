# ANGULAR CALLING API 

## What is *Http* and *Rest API's* ?

**HTTP** is a communications protocol that transports messages over a network. **Rest** is a protocol to exchange any(*XML or JSON*) messages that can use HTTP to transport those messages.

A RESTful API is an architectural style for an application program interface (API) that uses HTTP requests to access and use data. That data can be used to GET, PUT, POST and DELETE data types, which refers to the reading, updating, creating and deleting of operations concerning resources.

---------------

## About this exercise

In this lab we will be working on two code Bases, **Backend Code base** and **Frontend Code Base**

### **Backend Code Base:**

Previously we developed a base structure of an api solution in Asp.net core that have just one function which returns data of the last three years total balances against a given AccountID.
 
![MicrosoftTeams-image (1)](https://user-images.githubusercontent.com/100709775/161592915-395a3983-2efb-459d-ac63-1815249193f7.png)

There are 4 Projects in the solution.

- **Entities** : That have DB Model Account with one-to-many Transaction and Response Model of LineGraphData that will be returned as API Response.
- **Infrastructure**: BBBankContext that serves as fake DBContext that populates one Account with three Transactions with hardcoded data.
- **Services**: That has TransactionService with the logic of converting Account and its Transactions into LineGraphData after fetching it from BBBankContext.

- **BBBankAPI**: That has TransactionController which is implementation of ASP.net core’s API, to call Services layer.

![MicrosoftTeams-image](https://user-images.githubusercontent.com/100709775/161592969-78e99e2b-070f-45a5-a15f-8299364f0554.png)

For more details about this base project See: https://github.com/PatternsTechGit/PT_ServiceOrientedArchitecture

-----------

### **Frontend Code Base:**

Previously we scaffolded a new Angular application in which we have integrated 

* FontAwesome
* Bootstrap toolbar

![](/BBBank_UI/src/assets/images/1.png)

_____________

## In this exercise

* We will create client side models to receive data
* We will create transaction service to call the API
* We will fix the Cors Error on the server side
* We will populate and Html Table using data returned by API

### **Step 1: Creating client side model**

As mentioned above the JSON structure returned by API looks like this

```json
{
    "totalBalance": 3500,

    "labels": [
                "2020",
                "2021",
                "2022"
              ],
    "figures": [
                1000,
                500,
                3500
                ]
}
```

Now we will create a matching Type Script Model, called `LineGraphData`.

```ts
export interface LineGraphData {
                totalBalance: number
                labels: string[]
                figures: number[]
}
```

----------------

### **Step 2: Set API Url Base in Environment Variable**


To set this up

* Copy the Base URL from our API
* Then  create a variable `apiUrlBase` in our environment's type script file
* Assign this Url to the variable as show below

```ts
        export const environment = {
        apiUrlBase: 'http://localhost:5070/api/'
        };
```
 -------------------

 ### **Step 3: Creating transaction service**

 To create a transaction service we can follow these steps:
 * First import HttpClinetModule in *module.ts* file

 ```ts
 import { HttpClientModule } from '@angular/common/http';

 // adding http client module in imports section
 imports: [
    HttpClientModule 
  ]
  ```

  * Now we will create service named `transaction` from terminal using this command

  ```bash
  ng generate service transaction
  ```
  * In this service we will first import *HttpClient* and *LineGraphData* we have created
  ```ts
 // Importing modules
import {HttpClient} from '@angular/common/http'
import { LineGraphData } from '../models/line-graph-data';
  
  // Injecting HttpClient in the constructor 

constructor(private httpclient:HttpClient) { }
```
  * Now on the Api we have a function called GetLastThreeYearBalances that takes in the accountID as paramenter and can be accessed at location Transactio/GetLastThreeYearBalances. 
  
  We will create a function called getLastThreeYearBalances in transaction service to fetch that data from api.

  ```ts
  //returns Observable of LineGraphData after hitting the api using httpClient's Get method.

    getThreeYearsBalances(accountId :string):
        Observable<lineGraphData>{
        return this.httpclient.get<lineGraphData>
        (environment.apiUrlBase +
        'Transaction/GetLastThreeYearsBalancesById/'+ accountId);
  }
  ```
  ### **Step 4: Call the API and store the data**


  * Create a new component or choose existing *app.component.ts* file
  ```ts
  // Importing LineGraphData model and TransactionService
import { LineGraphData } from './models/line-graph-data';
import { TransactionService } from './services/transaction.service';
  
  // Creating a local variable LineGraphData 
LineGraphData: LineGraphData;
  ```
  >ERROR: If you face error while assigning this variable, It might be because of no permission in configuration file. 
  To solve this error use this permission in *tsconfig.json* file
  >```json
  >"strictPropertyInitialization": false
  >```
  
  ```ts
  // Inject transactionService in the constructor
  constructor(private transactionService: TransactionService) {}

  // Pass accountID in transaction service and `subscribe` to store returned data in LineGraphData
  
  ngOnInit(): void {
    this.transactionService
      .getThreeYearsBalances('37846734-172e-4149-8cec-6f43d1eb3f60')
      .subscribe({
        next: (data) => {
          this.LineGraphData = data;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  ```
  here `37846734-172e-4149-8cec-6f43d1eb3f60` is our hard coded account ID 

  Now variable *LineGraphData* has all the data that is available in API. 

 
 ### **Step 5: Allow Cross Origion Request**

  At this point you might face an error as no data has been returned from the Api. This may be because you have no permission to access the api. 
  
  Now will move to API's code to solve this issue.
  * Open *Program.cs* file 
  ```c#
  // Creating a local variable
  var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

  // Adding policy called MyAllowSpecificOrigins
  // Allowing all the requests from http://localhost:4200

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                                                  .AllowAnyMethod();
                      });
});

  // Configuring the HTTP request pipeline by using

 app.UseCors(MyAllowSpecificOrigins);
```

This procedure will successfully allow your Url to access your Api

### **Step 6:  Creating table and printing returned data**

* To make our table look good we will add following styling to our table in the component's *CSS* file 
```css
.table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
    border-color: rgba(255,255,255,.1);
    padding: 12px 7px;
    vertical-align: middle;
}
  .table>tbody>tr>td, .table>thead>tr>th, .table>tfoot>tr>th {
    color: rgba(255,255,255,.7)!important;
}
 .table>thead>tr>th {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 500;
    border: 0;
}
```

* In  the *tempelate* we will first create table with the desired css classes
```html
<table width="100%" class="table table-striped table-hover">

</table>
```
* Now inside table create *head* and *body* of the table

  Html's head section:

  In our returned structure we have 2 arrays *labels* and *figures*. To show them in the column structure we will use following html code
  ```html
    <thead>
        <tr>
          <th width="20%">Years</th>
          <th width="20%">Balances</th>
        </tr>
    </thead>
  ```
  

  Html's body section:
  ```html
  <tbody>
        <tr *ngFor="let item of lineGraphData?.labels; let i = index">
          <td>
            {{ item }}
          </td>
          <td>
            {{ lineGraphData.figures[i] }}
          </td>
        </tr>
      </tbody>
  ```
  In this we have used *for loop* on labels to print Labels data in first column while saving index value in variable *'i'*.

  On the same time we will print figures in next column while using that index value. 

-----------
### Final output will look like this

![](/BBBank_UI/src/assets/images/2.png)


 






