import "mocha";
import { expect } from "chai";
import { Singleton, Injectable, Inject } from "../lib";

@Injectable
export class A {
  public name = "Something";
}

@Singleton
export class B {
  @Inject("A") public a: A;
}

@Singleton
export class C {
  @Inject("A") public a: A;
}

describe("Singleton", () => {
  it("should be equal", () => {
    const aa = new A();
    const bb = new B();
    const cc = new C();

    expect(bb.a).to.not.equal(aa);
    expect(cc.a).to.not.equal(aa);
    expect(bb.a).to.not.equal(cc.a);
    expect(aa).to.equal(aa);
  });
});
