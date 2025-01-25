const script = require('../script.js').default;
const { add } = script;

console.log(add);

QUnit.module('add');

QUnit.test('add test', (assert) =>{
    assert.equal(add(1, 2), 3);
});

