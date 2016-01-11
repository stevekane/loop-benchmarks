var BM = require('benchmark')
var babel = require('babel-core')
var iter = new BM.Suite

var babelOptions = { presets: ['es2015'] }
var transpiled = babel.transform('for (var item of array) item.id++', babelOptions).code

function setup () {
  var array = []
  var i = 0
  
  while (i++ < 1000) array.push({id: i}) 
}

function forEach () {
  array.forEach(function (item) { item.id ++ })
}

function forOf () {
  for (var item of array) item.id++
}

function forLoop () {
  for (var i = 0, item; item = array[i]; i++) item.id++
}

function whileLoop () {
  var i = 0
  var item 

  while (item = array[i++]) item.id++
}

iter.add('for-of', { setup: setup, fn: forOf })
iter.add('for-of-transpiled', { setup: setup, fn: transpiled })
iter.add('for-each', { setup: setup, fn: forEach })
iter.add('for', { setup: setup, fn: forLoop })
iter.add('while', { setup: setup, fn: whileLoop })
iter.on('cycle', function (event) {
	console.log(event.target.options.fn.toString())
  console.log(String(event.target))
})
iter.on('complete', function () {
  console.log('FASTEST OPTIONS:', this.filter('fastest').map('name'))
})

iter.run()
