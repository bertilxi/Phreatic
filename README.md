# Phreatic Dependency Injector

### WIP

```Bash
npm install --save phreatic
# OR
yarn add phreatic
```

```Typescript
import { Inject, Injectable, get, createInjectable } from "phreatic";

@Injectable
export class User {
  public name = "user pepito";
  public password;
  @Inject("HttpService") public http;
}

export class Role {
  public name = "role pepito";
  public password;
}

@Injectable
export class HttpService {
  public name = "http service";
  @Inject("User") public user: User;
  @Inject("Role") public role: Role;
}

createInjectable(new Role());

const http = get(HttpService);
const user = get<any>("User");

// Valid uses
console.log(http.role.name);
console.log(http.user.name);
console.log(user.http.user.http.user.http.user.name);
console.log(user.http.user.http.user.http.name);
```
