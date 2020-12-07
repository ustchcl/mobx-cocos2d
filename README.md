# MobileGameTemplate
Mobx 

```typescript
import { autorun, makeAutoObservable } from "mobx"
import { BaseComponent } from "../basic/BaseComponent"
import { safeRemove } from "../basic/BaseFunction"
import * as TodoItem from "./TodoItem"
const { ccclass, property } = cc._decorator

// 状态定义
type Todo = {
  id: number;
  description: string;
  done: boolean;
}

class TodoState {
  todoList: Todo[] = []
  incrementalId: number = 1

  constructor() {
    makeAutoObservable(this)
  }

  get doneNum() {
    return this.todoList.filter(x => x.done).length
  }

  get todoNum() {
    return this.todoList.length
  }
}

// Action 定义
type Action
  = ["AddTodo", string]
  | TodoItem.Action

@ccclass
export class TodoExample extends BaseComponent<{}, TodoState, Action> {
  @property(cc.Prefab) itemPrefab: cc.Prefab = null
  @property(cc.Button) addButton: cc.Button = null
  @property(cc.EditBox) input: cc.EditBox = null
  @property(cc.Node) scrollContentNode: cc.Node = null
  @property(cc.Label) statLabel: cc.Label = null

  state = new TodoState()

  // 在start里面绑定事件
  start() {
    // events
    this.onTouchEndEffect(this.addButton.node, () => ["AddTodo", this.input.string])

    this.disposers = [
      autorun(() => this.renderList(this.state.todoList)),
      autorun(() => this.renderStat(this.state.doneNum, this.state.todoNum))
    ]
  }

  // eval 处理action
  eval(action: Action) {
    switch (action[0]) {
      case "AddTodo":
        this.state.todoList.push({ id: this.state.incrementalId++, description: action[1], done: false })
        break;
      case "DeleteTodo":
        this.state.todoList = this.state.todoList.filter(x => x.id !== action[1])
        break;
      case "SwitchTodo":
        const todo = this.state.todoList.find(x => x.id === action[1])
        if (todo) {
          todo.done = !todo.done
        }
        break;
    }
  }

  // render :: Start -> Void 显示逻辑
  renderStat(doneNum: number, totalNum: number) {
    this.statLabel.string = `进度: ${doneNum}/${totalNum}`
  }

  // 一个简单的diff
  renderList(todoList: Todo[]) {
    const curr = this.scrollContentNode.children.map(child => child.getComponent(TodoItem.TodoItem))
    const newKeys = todoList.map(x => x.id)
    curr.forEach(x => {
      if (!newKeys.includes(x.key as number)) {
        safeRemove(x.node)
      }
    })
    todoList.forEach(todo => {
      const oldItem = curr.find(y => y.key === todo.id)
      if (oldItem) {
        oldItem.init(todo)
        oldItem.node.parent = this.scrollContentNode
      } else {
        const node = cc.instantiate(this.itemPrefab)
        node.parent = this.scrollContentNode
        const todoItem = node.getComponent(TodoItem.TodoItem)
        todoItem.props({
          key: todo.id,
          handler: this.eval.bind(this),
          options: todo
        })
      }
    })
  }
}
```

### 1. Component
```
+---------------------------+
|       +--------------+    |
| +---+ | state (mobx) |    |
| |     +--------------+    |    
| |           ↑             |
| |     +--------------+    |                 +------------------+              
| |     | eval         |    |    - action →   | Parent           | 
| |     +--------------+    |    ← props -    | Component        |
| |           ↑             |                 +------------------+
| |     +--------------+    |
| +---> | ui           |    |
|       +--------------+    |
|                           |
| A component has state &   |
| props & action            |
|                           |
+---------------------------+
```