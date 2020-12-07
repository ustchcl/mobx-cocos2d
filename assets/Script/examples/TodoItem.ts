import { BaseComponent } from "../basic/BaseComponent"

const {ccclass, property} = cc._decorator

type Todo = {
  id: number;
  description: string;
  done: boolean;
}

export type Action
  = ["SwitchTodo", number]
  | ["DeleteTodo", number]

@ccclass
export class TodoItem extends BaseComponent<Todo, {}, Action> {
  @property(cc.Button) deleteBtn: cc.Button = null
  @property(cc.Button) switchBtn: cc.Button = null
  @property(cc.Label) text: cc.Label = null
  @property(cc.Label) switchBtnText: cc.Label = null
  
  init(todo: Todo) {
    this.todo = todo
    this.render()
  }

  todo: Todo = {
    id: -1,
    description: "",
    done: false
  }

  eval(action: Action) {
    this.emit(action)
  }

  start() {
    this.onTouchEnd(this.deleteBtn.node, ["DeleteTodo", this.todo.id])
    this.onTouchEnd(this.switchBtn.node, ["SwitchTodo", this.todo.id])
  }

  render() {
    this.text.string = this.todo.description
    this.switchBtnText.string = this.todo.done ? "重做" : "完成"
  }

}