import "mocha";

import { expect } from "chai";

import { clearContainer, Inject, Injectable, Singleton } from "../lib";

describe("Singleton", () => {
  beforeEach(() => {
    clearContainer();
  });
  it("Should be different", () => {
    @Injectable
    class A {
      public name = "Something";
    }

    @Singleton
    class B {
      @Inject("A") public a: A;
    }

    @Singleton
    class C {
      @Inject("A") public a: A;
    }

    const aa = new A();
    const bb = new B();
    const cc = new C();
    const a2 = new A();
    const b2 = new B();
    const c2 = new C();

    expect(bb.a).to.not.equal(aa);
    expect(cc.a).to.not.equal(aa);
    expect(bb.a).to.not.equal(cc.a);
    expect(aa).to.not.equal(a2);
    expect(bb).to.equal(b2);
    expect(cc).to.equal(c2);
  });
  it("Should be equal", () => {
    @Singleton
    class HttpService {
      public name = "http service";
    }

    @Injectable
    class User {
      public name = "my user";
      @Inject("HttpService") public http;
    }

    class Role {
      public name = "my role";
      @Inject("HttpService") public http;
    }

    const user = new User();
    const role = new Role();

    expect(user.http).to.equal(role.http);
  });
});
