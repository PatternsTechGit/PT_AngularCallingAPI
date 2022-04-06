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
- **Services**: That has TranasacionService with the logic of converting Account and its Transactions into LineGraphData after fetching it from BBBankContext. 

- **BBBankAPI**: That has TransactionController which is implementation of ASP.net core’s API, to call Services layer. 

![MicrosoftTeams-image](https://user-images.githubusercontent.com/100709775/161592969-78e99e2b-070f-45a5-a15f-8299364f0554.png)

For more details about this base project See: https://github.com/PatternsTechGit/PT_ServiceOrientedArchitecture

-----------

### **Frontend Code Base:**

Previously we scafolded a new Angular application in which we have integrated 

* FontAwesome
* Bootstrap toolbar

![](/BBBank_UI/src/assets/images/1.png)

_____________

## In this exercise

* We will create client side models to receive data
* We will create transaction service to call the API
* We will fix the Cors Error on the server side
* We will populte and Html Table using data returned by API

### **Step 1: Creating client side model**

As mentioned above the `JSON `structure returned by API looks like this

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

Now we will create a matching `Type Script Model` from this returned data. Our Type Script Model will look like this:

```ts
export interface LineGraphData {
                totalBalance: number
                labels: string[]
                figures: number[]
}
```

----------------

### **Step 2: Set API Url Base in Enviorment Variable**

What Does Base URL Mean? 

In web development, design applications can define a base URL or base location, which helps in converting relative web URLs on the specific page to absolute web URLs

To set this up

* Copy the Base URL from our API
* Then  create a variable `apiUrlBase` in our enviornment's type script file
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
 ```
 in imports section also add this module

 ```ts
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
import {HttpClient} from '@angular/common/http'
import { lineGraphData } from '../models/line-graph-data';
  ```
  * We will create a constructor and assign local variable *HttpClient* 
```ts
constructor(private httpclient:HttpClient) { }
```
  * Now on the Api we have a function called GetLastThreeYearBalances that takes in the accountID as paramenter and can be accessed at location Transactio/GetLastThreeYearBalances. 
  
  We will create a function called getLastThreeYearBalances in transaction service to fetch that data from api.

  ```ts
  //retruns Observable of LineGraphData after hitting the api using httpClient's Get method.

    getThreeYearsBalances(accountId :string):
        Observable<lineGraphData>{
        return this.httpclient.get<lineGraphData>
        (environment.apiUrlBase +
        'Transaction/GetLastThreeYearsBalancesById/'+ accountId);
  }
  ```
  ### **Step 4: Call the API and store the data**

  In this step we will follow these further steps to complete the task:
  * Create a new component or choose existing *app.component.ts* file
  * Import *LineGraphData* model and *TransactionService* we created
  ```ts
import { lineGraphData } from './models/line-graph-data';
import { TransactionService } from './services/transaction.service';
  ```
  * Create local variable *LineGraphData* of `LineGraphData` type 
  ```ts
lineGraphData: lineGraphData;
  ```
  ERROR: At this stage if you face error while asigning this variable, It might be because of no permission in configuration file. 
  To solve this error use this permission in *tsconfig.json* file
  ```json
  "strictPropertyInitialization": false
  ```
  * Create a constructor and assign variable *transactionService* to `TransactionService` type
  ```ts
  constructor(private transactionService: TransactionService) {}
  ```

  * Now we will pass accountID in transaction service and use `subscribe` to store returned data in *lineGraphData*
  ```ts
  ngOnInit(): void {
    this.transactionService
      .getThreeYearsBalances('37846734-172e-4149-8cec-6f43d1eb3f60')
      .subscribe({
        next: (data) => {
          this.lineGraphData = data;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  ```
  here `37846734-172e-4149-8cec-6f43d1eb3f60` is our hard coded account ID we got from API Url

  Now variable *LineGraphData* has all the data that is available in API. 

 
 ### **Step 5: Allow Cross Origion Request**

  At this point you must face an error as no data has been returned from the Api. This may be because you have no permission to access the api. 
  
  Now will move to API's code to solve this issue.
  * In *Program.cs* file use this command to assign variable
  ```c#
  var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
  ```
  * Now use this code and paste our URL by which we are trying to reach this API. In our case this URL is http://localhost:4200

  ```c#
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

  ```
  * Now  Configure the HTTP request pipeline by using

```c#
app.UseCors(MyAllowSpecificOrigins);
```

This procedure will successfully allow your Url to access your Api

### **Step 6:  Creating table and printing returned data**

* In *Html* file we will first create table while use desired class
```html
<table width="100%" class="table table-striped table-hover">

</table>
```
* Now inside table create *head* and *body* of the table

  To create head use:
  ```html
    <thead>
        <tr>
          <th width="20%">Years</th>
          <th width="20%">Balances</th>
        </tr>
    </thead>
  ```
  here our first rows are hard coded as this data is not variable

  To create body use:
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
* To make our table look good we will add styling to our table. To fulfil this we will use this in component's *CSS* file 
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
-----------
### This will fulfill the task and our final output will look like this
![](/BBBank_UI/src/assets/images/2.png)


 






