import "mocha";
import { expect } from "chai";
import { Inject, Injectable, createInjectable, get } from "../lib";

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

describe("Injector", () => {
  it("should inject", () => {
    const http = get(HttpService);
    const user = get<any>("User");

    expect(http.role.name).to.equal("role pepito");
    expect(http.user.name).to.equal("user pepito");
    expect(user.http.user.http.user.http.user.name).to.equal("user pepito");
    expect(user.http.user.http.user.http.name).to.equal("http service");
  });
});
