class Cmd {
  thenShowFrame(...args) {
    return new ShowFrame(this, ...args)
  }
}