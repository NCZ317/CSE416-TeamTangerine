import jsTPS_Transaction from "../common/jsTPS.js"

export default class UpdateLayer_Transaction extends jsTPS_Transaction {
    constructor(initStore, initOldLayer, initNewLayer) {
        super();
        this.store = initStore;
        this.oldLayer = initOldLayer;
        this.newLayer = initNewLayer
        console.log(this.oldLayer);
        console.log(this.newLayer)
    }

    doTransaction() {
        this.store.updateCurrentMapLayer(this.newLayer);
    }

    undoTransaction() {
        this.store.updateCurrentMapLayer(this.oldLayer);
    }
}