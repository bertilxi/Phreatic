# Phreatic Dependency Injector

### WIP

```Bash
npm install --save phreatic
# OR
yarn add phreatic
```


```Typescript
@Injectable()
class User {
  public name = "my user";
  public password;
  @Inject("HttpService") public http;
}

class Role {
  public name = "my role";
  public password;
}

@Injectable()
class HttpService {
  public name = "http service";
  @Inject("User") public user: User;
  @Inject("Role") public role: Role;
}

doInjectable(new Role());

const http: any = new HttpService();
const user: any = new User();

// Valid uses
console.log(http.role.name);
console.log(http.user.name);
console.log(user.http.user.http.user.http.user.name);
console.log(user.http.user.http.user.http.name);

```
