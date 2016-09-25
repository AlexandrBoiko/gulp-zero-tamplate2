bower i && npm i && gulp sprites && gulp


исправляем миксин в файле src/style/sprite.scss на вид 
строчка кода в "mixin sprite-image"  background-image: url(#{$sprite-image});
на  background-image: url(../img/sprite/#{$sprite-image}); и так каждый раз при запуске задачи 
spites


