.PHONY: clean package

# Directory where built files will go
BUILD_DIR = build/

EXT_NAME = firefox-org-mode.zip

clean:
	@rm -rf $(BUILD_DIR)

prepare: clean
	@mkdir -p $(BUILD_DIR)
	@cp -r background.js manifest.json $(BUILD_DIR)

package: prepare
	@cd $(BUILD_DIR) && zip -r ../$(EXT_NAME) ./*
	@echo "Extension packaged as $(EXT_NAME)"

