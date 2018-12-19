workflow "New workflow" {
  on = "push"
  resolves = ["Test"]
}

action "Build" {
  uses = "actions/npm@c555744"
  args = "build"
}

action "Test" {
  uses = "actions/npm@c555744"
  needs = ["Build"]
  args = "test"
}
