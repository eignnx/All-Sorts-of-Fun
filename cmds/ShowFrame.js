NewlessCtor(
class ShowFrame extends Cmd {
  constructor(...tags) {
    super()
    this.tags = tags
  }

  apply(state) {
    for (const tag of this.tags) {
      tag.apply(state)
    }
  }
})