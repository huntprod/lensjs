JS_FILES :=
JS_FILES += init.js
JS_FILES += log.js
JS_FILES += diffpatch.js
JS_FILES += template.js
JS_FILES += strftime.js

lens.js: $(JS_FILES)
	cat $+ > $@
