workflow "New workflow" {
  on = "push"
  resolves = ["Test"]
}

action "Install" {
  uses = "actions/npm@c555744"
  args = "install"
}

action "Build" {
  uses = "actions/npm@c555744"
  args = "run build"
  needs = ["Install"]
}

action "Test" {
  uses = "actions/npm@c555744"
  needs = ["Build"]
  args = "run test"
}
