import { SecondConfirm } from "./SecondConfirm";
import { TOUCH_END } from "../../basic/Constants";
import { safeRemove } from "../../basic/BaseFunction";

export type SecondConfirmType
    = ["ExitSecondConfirm"]
    | ["SaveConfigConfirm", number, number]

export async function showSC(scType: SecondConfirmType): Promise<boolean> {
    let sc: SecondConfirm = null;
    switch (scType[0]) {
        case "ExitSecondConfirm": {
          break;
        }
        case "SaveConfigConfirm": {
          console.log(scType[1], scType[2]);
          break;
        }
    }

    return new Promise<boolean>(function(resolve) {
        sc.cancelBtn.node.on(TOUCH_END, () => {
            safeRemove(sc.node);
            resolve(false);
        });
        sc.yesBtn.node.on(TOUCH_END, () => {
            safeRemove(sc.node);
            resolve(true);
        });
    });
}
