import { clearContainer, Inject, Injectable, Singleton } from "../src";

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
      @Inject("A")
      public a: A;
    }

    @Singleton
    class C {
      @Inject("A")
      public a: A;
    }

    const aa = new A();
    const bb = new B();
    const cc = new C();
    const a2 = new A();
    const b2 = new B();
    const c2 = new C();

    expect(bb.a).not.toBe(aa);
    expect(cc.a).not.toBe(aa);
    expect(bb.a).not.toBe(cc.a);
    expect(aa).not.toBe(a2);
    expect(bb).toEqual(b2);
    expect(cc).toEqual(c2);
  });

  it("Should be equal", () => {
    @Singleton
    class HttpService {
      public name = "http service";
    }

    @Injectable
    class User {
      public name = "my user";
      @Inject("HttpService")
      public http;
    }

    class Role {
      public name = "my role";
      @Inject("HttpService")
      public http;
    }

    const user = new User();
    const role = new Role();

    expect(user.http).toEqual(role.http);
  });
});
