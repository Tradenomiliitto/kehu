#!/bin/bash
grep -ohP '(?<!\w)t\(.*?\)' views/*.pug | tac | sed 's/t(\(.\)/t(\1translation-public:/g' | tee dummy.js
