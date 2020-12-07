import { Component } from "./Component";
import { Fn, Effect } from "./Types";
import { TOUCH_END } from "./Constants";
import { GlobalEnv } from "./GlobalEnv";
import { GlobalAction } from "../core/GlobalAction";
import { Optional } from "./Optional";
import { IReactionDisposer } from "mobx"


export abstract class BaseComponent<Props = {}, State = {}, Action = {}> extends cc.Component implements Component<Props, State, Action> {
    state: State;
    disposers: Array<IReactionDisposer> = [];

    // parent's action handler
    actionHandler: (e: Action) => void;
    key: string | number;

    init(options: Props): void {}

    props(props: {
        key?: string | number;
        handler?: (action: Action) => void;
        options?: Props;
    }): void {
        this.key = props.key ?? ""
        this.actionHandler = props.handler ?? (e => console.warn(`This is no handler for event ${e}`)),
        this.init(props.options)
    }
    
    emit(e: Action): void {
        this.actionHandler(e)
    }

    eval (action: Action): void {
        console.warn(`This is no handler for event ${action}`)
    }

    query<T>(extractor: Fn<State, T>) {
        return extractor(this.state);
    }

    onTouchEnd(node: cc.Node, action: Action) {
        node.on(TOUCH_END, () => this.eval(action));
    }

    onTouchEndEffect(node: cc.Node, func: Effect<Action>) {
        node.on(TOUCH_END, () => {
            let action = func();
            if (action) {
                this.eval(action)
            }
        });
    }

    onTouchEndEffectMaybe(node: cc.Node, func: Effect<Optional<Action>>) {
        node.on(TOUCH_END, () => {
            let action = func();
            action.fold(val => this.eval(val), () => {});
        });
    }

    onTouchEndGlobal(node: cc.Node, action: GlobalAction) {
        node.on(TOUCH_END, () => GlobalEnv.getInstance().dispatchAction(action));
    }

    onTouchEndGlobalEffect(node: cc.Node, func: Effect<GlobalAction>) {
        node.on(TOUCH_END, () => {
            let action = func();
            if (action) {
                GlobalEnv.getInstance().dispatchAction(action)
            }
        });
    }

    /**
     * 向全局发射事件，关心此事件的地方
     * 可以filter指定事件名字，然后监听
     */
    dispatch(action: GlobalAction) {
        GlobalEnv.getInstance().dispatchAction(action);
    }

    onDestroy() {
        this.disposers.forEach(disposer => disposer() );
    }
}
