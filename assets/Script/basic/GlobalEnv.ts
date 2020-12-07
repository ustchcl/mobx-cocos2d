import { GlobalAction } from "../core/GlobalAction";
import { observable } from "mobx"

export class GlobalEnv {
    private static _instance: GlobalEnv = null;

    @observable
    public globalAction: GlobalAction = ["InitialAction"];
    
    private constructor() {}

    public static getInstance (): GlobalEnv {
        if (this._instance == null) {
            this._instance = new GlobalEnv();
        }
        return this._instance;
    }

    dispatchAction(action: GlobalAction) {
        this.globalAction = action
    }
}