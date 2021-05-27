import "reflect-metadata";
import {
  clearContainer,
  createInjectable,
  get,
  Inject,
  Injectable
} from "../src";

describe("Injectable", () => {
  beforeEach(() => {
    clearContainer();
  });
  it("should inject", () => {
    @Injectable
    class User {
      public name = "my user";
      public password;
      @Inject("HttpService")
      public http;
    }

    class Role {
      public name = "my role";
      public password;
    }

    @Injectable
    class HttpService {
      public name = "http service";
      @Inject("User")
      public user!: User;
      @Inject("Role")
      public role!: Role;
    }

    createInjectable(new Role());

    const http = get(HttpService);
    const user = get<any>("User");

    expect(http.role.name).toEqual("my role");
    expect(http.user.name).toEqual("my user");
    expect(user.http.user.http.user.http.user.name).toEqual("my user");
    expect(user.http.user.http.user.http.name).toEqual("http service");
  });
});
