## Changelog

**(23.09.2018)**
- Update all packages versions and fix it 
- Update source code for working with latest packages 

## Attempt to implement the correct application architecture
This example represents one possible implementation of a business logic layer, and serve as the starting point in the training of forming the project structure.

**Why "attempt" and not the final realization?**

Because the goal of all projects are different, as well as a vision of business issues every developer involved in the project.

### How it works?

The first thing to understand is that there are several so-called layers of your project. I see the project in the following interpretations:
- **«Service layer»** - the layer which handles the incoming data from the user and generates the necessary answer script as a result of mining
- **«Business Layer»** - layer which is responsible for a particular function, and does not know anything about the data that actually have been received from the user or from other sources.
- **«Data layer»** - is responsible for specific transactions are allowed for the current model (table), for example basic CRUD.

### And why do I need this?
This separation helps to better structure your code and avoid piling up logic. 
Consider this example: user registration. Suppose we have a REST request from a user-defined fields, for simplicity we take the login / password. In this case, the layers will have the following roles: 
- **Service layer** - forming data validity checking username, password as the text values (or other criteria) to clean debris from the data and generate a request to the business layer. 
- **Business layer** - must obtain the "entrance", "clean" data manipulation to spend with them and call the model methods. 
- **Data layer** just manages preservation / creation and other methods and do not know anything about the data itself. 

![alt text](https://image.ibb.co/hyoHOQ/Main.png)
*Summarize it in a VERY simplified form*<br />
**Service layer**: clears the data and generates a response from the business layer. <br />
**Business layer**: performs all data manipulation: the criterion sampling, filters and other "business objectives". <br />
**Data layer**: performs CRUD operations so that receives from business layer. <br />

In this embodiment, the *service layer* is *«controllers»*, the *business layer* is *«repositories»* and *data layer is «models»*
## Used libs
Use [dynamic-config](https://github.com/peerigon/dynamic-config) for config enviroment.<br />
[Express](https://github.com/expressjs/express) as web framework for [node](https://nodejs.org/en/).<br />
[TypeScript](https://github.com/Microsoft/TypeScript) as language for application-scale JavaScript.<br />
[JWT](https://jwt.io) for user authorization.<br />
[Mocha](https://mochajs.org) and [Chai](http://chaijs.com) for testing, also [Chai-http](https://github.com/chaijs/chai-http) for integration test.

## Installation
Make git clone or zip download and move to the directory
```
sudo npm install -g gulp typescript
npm install
```
## Tests
Use mocha, chai and chai-http for test.
```
gulp test
```
![alt text](https://image.ibb.co/bs1e3Q/Tests.png)
## Contributors

This code is implemented model of the user including the CRUD operations and authorization based on token jwt and of course it is accompanied by tests.
Good luck!

## License
MIT License

Copyright (c) [2017] [Brickiy Sergey]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
