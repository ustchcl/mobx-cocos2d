import { Fn } from "./Types";
import {  autorun, IReactionDisposer } from "mobx"
import * as R from "ramda";
import { Optional } from "./Optional";
// import ShaderComponent from "../extension/shader/ShaderComponent";
// import { ShaderType } from "../extension/shader/ShaderManager";


/**
 * Produces a random number between min and max(inclusive).
 * `random(1, 5); // -> an integer between 0 and 5`
 * `random(5); // -> an integer between 0 and 5`
 * `random(1.2, 5.2, true); /// -> a floating-point number between 1.2 and 5.2`
 */
export function random(min: number, max?: number, floating?: boolean): number {
    if (max == null) {
        max = min;
        min = 0;
    }
    let rand = Math.random();
    if (floating || min % 1 || max % 1) {
        return Math.min(
            min +
                rand *
                (max - min + parseFloat('1e-' + ((rand + '').length - 1))),
            max
        )
    } else {
        return min + Math.floor(rand * (max - min + 1));
    }
}


export function count<T>(val: T, arr: T[]): number {
    return R.filter(R.equals(val), arr).length;
}


/**
 * example: 
 * prefixNum(1, 2); // '02'
 * prefixNum(12, 4); // '0012'
 * @param num 要格式化的数字
 * @param length 格式化后的长度
 */
export function prefixNum(num: number, length: number): string {
    let str = String(num);
    return R.repeat("0", length - str.length) + str;
}

/**
 * 移除节点
 * @param node '要移除的节点
 */
export function safeRemove(node: cc.Node):void {
    if (node && node.parent) {
        node.parent.removeChild(node);
        node.destroy();
    }
}

/**
 * wait for `n` seconds
 */
 export function wait(seconds: number) {
     return new Promise<void>(function(resolve) {
         setTimeout(resolve, seconds * 1000);
     })
 }

// /**
// * 灰度化一张图片 By ShaderComponent
// * @param sprite 图片
// */
// export function grey(node: cc.Node) {
//     if (!node) {
//         return;
//     }
//     let shader = node.getComponent(ShaderComponent);
//     if (shader) {
//         shader.shader = ShaderType.Gray;
//     }
// }

// /**
//  * 取消灰度化
//  * @param sprite 图片
//  */
// export function ungrey(node: cc.Node) {
//     if (!node) {
//         return;
//     }
//     let shader = node.getComponent(ShaderComponent);
//     if (shader) {
//         shader.shader = ShaderType.Default;
//     }
// }