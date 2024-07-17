
#!/bin/bash

file="./node_modules/@feathersjs/hooks/script/hooks.d.ts"
old_word="DecoratorContext"
new_word="any"
line_number=9
position=99

sed -i "${line_number}s/\<${old_word}\>/${new_word}/g" "${file}"