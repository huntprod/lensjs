JS_FILES :=
JS_FILES += template.js
JS_FILES += strftime.js

lens.js: $(JS_FILES)
	cat $+ > $@
