import "mocha";

import { expect } from "chai";

import { Inject, Injectable, doInjectable } from "../lib";

describe("Injector", () => {
  it("should inject", () => {
    @Injectable()
    class User {
      public name = "user pepito";
      public password;
      @Inject("HttpService") public http;
    }

    class Role {
      public name = "role pepito";
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
    const u: any = new User();

    expect(http.role.name).to.equal("role pepito");
    expect(http.user.name).to.equal("user pepito");
    expect(u.http.user.http.user.http.user.name).to.equal("user pepito");
    expect(u.http.user.http.user.http.name).to.equal("http service");
  });
});
