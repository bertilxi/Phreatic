workflow "New workflow" {
  on = "push"
  resolves = ["Test"]
}

action "Build" {
  uses = "actions/npm@c555744"
  runs = "build"
}

action "Test" {
  uses = "actions/npm@c555744"
  needs = ["Build"]
  runs = "test"
}
