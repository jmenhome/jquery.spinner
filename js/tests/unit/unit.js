(function($) {
  'use strict';

  QUnit.module('Spinner', {
    beforeEach: function() {
      this.el = $('[data-trigger="spinner"]');
      this.spinUp = $("[data-spin='up']", this.el);
      this.spinDown = $("[data-spin='down']", this.el);
      this.spinner = this.el.data('spinner');
    },
    afterEach: function(){
      this.el
        .spinner('delay', 500)
        .spinner('changed', null)
        .spinner('changing', null);
      this.spinner.spinning.$el.val(1);
    }
  });

  QUnit.test('Spinner#value', function(assert) {
    assert.strictEqual(this.spinner.value(), 1);
  });

  QUnit.test('Spinner#delay', function(assert) {
    assert.strictEqual(this.spinner.constructor.delay, 600);
    this.el.spinner('delay', 300, 'should plus 100');
    assert.strictEqual(this.spinner.constructor.delay, 400);
  });

  QUnit.test('Spinner#changed', function(assert) {
    var x = this.spinner.value(), y = 0;
    this.el.spinner('delay', 50).spinner('changed', function(e, newVal){
      y = newVal;
    });
    this.spinUp.click();
    var done = assert.async();
    setTimeout(function(){
      assert.strictEqual(y, x+1);
      done();
    }, 200);
  });

  QUnit.test('Spinner#changing', function(assert) {
    this.el.spinner('changing', function(e, newVal){
      assert.strictEqual(newVal, 2);
    });
    this.spinUp.click();
  });

  QUnit.test('spin via mouse click', function(assert) {
    assert.strictEqual(this.spinner.value(), 1);
    this.spinUp.click();
    assert.strictEqual(this.spinner.value(), 2);
    this.spinDown.click();
    assert.strictEqual(this.spinner.value(), 1);
  });

  QUnit.test('pass step as a function', function(assert){
    assert.strictEqual(this.spinner.value(), 1);
    this.spinner.spinning.options.step = function(dir){ //to skip 0
      if((this.oldValue === 1 && dir === 'down') || (this.oldValue === -1 && dir === 'up')){
        return 2;
      }
      return 1;
    };
    this.spinDown.click();
    assert.strictEqual(this.spinner.value(), -1);
    this.spinUp.click();
    assert.strictEqual(this.spinner.value(), 1);
  });

  QUnit.test('no spinning on disabled input', function(assert) {
      this.spinner.spinning.$el.attr('disabled', 'disabled');
      assert.strictEqual(this.spinner.value(), 1);
      this.spinUp.click();
      assert.strictEqual(this.spinner.value(), 1);
      this.spinner.spinning.$el.val(2);
      this.spinDown.click();
      assert.strictEqual(this.spinner.value(), 2);
      this.spinner.spinning.$el.removeAttr('disabled');
  });
})(jQuery);
