/**
 * @license
 * Copyright 2019 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ZXing = {})));
}(this, (function (exports) { 'use strict';

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
	            t[p[i]] = s[p[i]];
	    return t;
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __param(paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	function __awaiter(thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	function __exportStar(m, exports) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}

	function __values(o) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
	    if (m) return m.call(o);
	    return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	function __await(v) {
	    return this instanceof __await ? (this.v = v, this) : new __await(v);
	}

	function __asyncGenerator(thisArg, _arguments, generator) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var g = generator.apply(thisArg, _arguments || []), i, q = [];
	    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
	    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
	    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
	    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
	    function fulfill(value) { resume("next", value); }
	    function reject(value) { resume("throw", value); }
	    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
	}

	function __asyncDelegator(o) {
	    var i, p;
	    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
	    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
	}

	function __asyncValues(o) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var m = o[Symbol.asyncIterator], i;
	    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
	    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
	    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
	}

	function __makeTemplateObject(cooked, raw) {
	    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
	    return cooked;
	};

	function __import(m) {
	    if (this && this.__import) return this.__import(m);
	    var e = new Error("Cannot find module '" + m + "'.");
	    e.code = "MODULE_NOT_FOUND";
	    throw e;
	}

	function __importDefault(m) {
	    return m && m.__esModule ? m : { default: m };
	}

	/*
	 * Copyright 2007 ZXing authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * <p>Encapsulates the result of decoding a barcode within an image.</p>
	 *
	 * @author Sean Owen
	 */
	var Result = /** @class */ (function () {
	    function Result(text, rawBytes, numBits, resultPoints, format, timestamp) {
	        if (numBits === void 0) {
	            numBits = rawBytes === null || rawBytes === undefined ? 0 : rawBytes.length * 8;
	        }
	        if (timestamp === void 0) {
	            timestamp = Date.now();
	        }
	        this.text = text;
	        this.rawBytes = rawBytes;
	        this.numBits = numBits;
	        this.resultPoints = resultPoints;
	        this.format = format;
	        this.timestamp = timestamp;
	        this.resultMetadata = new Map();
	    }
	    /**
	     * @return raw text encoded by the barcode
	     */
	    Result.prototype.getText = function () {
	        return this.text;
	    };
	    /**
	     * @return raw bytes encoded by the barcode, if applicable, otherwise {@code null}
	     */
	    Result.prototype.getRawBytes = function () {
	        return this.rawBytes;
	    };
	    /**
	     * @return how many bits of {@link #getRawBytes()} are meaningful; might be less than
	     * {@code getRawBytes().length * 8} if bit-padding was required
	     */
	    Result.prototype.getNumBits = function () {
	        return this.numBits;
	    };
	    /**
	     * @return points tracing the barcode in the image. These are given as points in the overall
	     * image coordinates, not points within the cropped region passed to the decoder.
	     */
	    Result.prototype.getResultPoints = function () {
	        return this.resultPoints;
	    };
	    /**
	     * @return {@link BarcodeFormat} representing the format of the barcode that was decoded
	     */
	    Result.prototype.getBarcodeFormat = function () {
	        return this.format;
	    };
	    /**
	     * @return {@link Map} mapping {@link ResultMetadataType} keys to values. May be
	     * {@code null}. This contains optional metadata about given decodes. It offers a way to
	     * communicate additional information about a barcode that is not encoded in the barcode itself.
	     * For example, see {@link ResultMetadataType#UPC_EAN_EXTENSION}.
	     */
	    Result.prototype.getResultMetadata = function () {
	        return this.resultMetadata;
	    };
	    Result.prototype.putMetadata = function (type, value) {
	        this.resultMetadata.set(type, value);
	    };
	    Result.prototype.putAllMetadata = function (metadata) {
	        if (null !== metadata) {
	            for (var _i = 0, _a = Array.from(metadata.entries()); _i < _a.length; _i++) {
	                var entry = _a[_i];
	                this.putMetadata(entry[0], entry[1]);
	            }
	        }
	    };
	    Result.prototype.addResultPoints = function (newPoints) {
	        var oldPoints = this.resultPoints;
	        if (oldPoints === null) {
	            this.resultPoints = newPoints;
	        }
	        else if (newPoints !== null && newPoints.length > 0) {
	            this.resultPoints = oldPoints.concat(newPoints);
	        }
	    };
	    Result.prototype.getTimestamp = function () {
	        return this.timestamp;
	    };
	    Result.prototype.toString = function () {
	        return this.text;
	    };
	    return Result;
	}());

	/*
	 * Copyright 2012 ZXing authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * Enumerates barcode formats known to this package. Please keep alphabetized.
	 *
	 * @author Sean Owen
	 */
	var BarcodeFormat;
	(function (BarcodeFormat) {
	    /** Aztec 2D barcode format. */
	    BarcodeFormat[BarcodeFormat["AZTEC"] = 0] = "AZTEC";
	    /** CODABAR 1D format. */
	    BarcodeFormat[BarcodeFormat["CODABAR"] = 1] = "CODABAR";
	    /** Code 39 1D format. */
	    BarcodeFormat[BarcodeFormat["CODE_39"] = 2] = "CODE_39";
	    /** Code 93 1D format. */
	    BarcodeFormat[BarcodeFormat["CODE_93"] = 3] = "CODE_93";
	    /** Code 128 1D format. */
	    BarcodeFormat[BarcodeFormat["CODE_128"] = 4] = "CODE_128";
	    /** Data Matrix 2D barcode format. */
	    BarcodeFormat[BarcodeFormat["DATA_MATRIX"] = 5] = "DATA_MATRIX";
	    /** EAN-8 1D format. */
	    BarcodeFormat[BarcodeFormat["EAN_8"] = 6] = "EAN_8";
	    /** EAN-13 1D format. */
	    BarcodeFormat[BarcodeFormat["EAN_13"] = 7] = "EAN_13";
	    /** ITF (Interleaved Two of Five) 1D format. */
	    BarcodeFormat[BarcodeFormat["ITF"] = 8] = "ITF";
	    /** MaxiCode 2D barcode format. */
	    BarcodeFormat[BarcodeFormat["MAXICODE"] = 9] = "MAXICODE";
	    /** PDF417 format. */
	    BarcodeFormat[BarcodeFormat["PDF_417"] = 10] = "PDF_417";
	    /** QR Code 2D barcode format. */
	    BarcodeFormat[BarcodeFormat["QR_CODE"] = 11] = "QR_CODE";
	    /** RSS 14 */
	    BarcodeFormat[BarcodeFormat["RSS_14"] = 12] = "RSS_14";
	    /** RSS EXPANDED */
	    BarcodeFormat[BarcodeFormat["RSS_EXPANDED"] = 13] = "RSS_EXPANDED";
	    /** UPC-A 1D format. */
	    BarcodeFormat[BarcodeFormat["UPC_A"] = 14] = "UPC_A";
	    /** UPC-E 1D format. */
	    BarcodeFormat[BarcodeFormat["UPC_E"] = 15] = "UPC_E";
	    /** UPC/EAN extension format. Not a stand-alone format. */
	    BarcodeFormat[BarcodeFormat["UPC_EAN_EXTENSION"] = 16] = "UPC_EAN_EXTENSION";
	})(BarcodeFormat || (BarcodeFormat = {}));
	var BarcodeFormat$1 = BarcodeFormat;

	/**
	 * Encapsulates a point of interest in an image containing a barcode. Typically, this
	 * would be the location of a finder pattern or the corner of the barcode, for example.
	 *
	 * @author Sean Owen
	 */
	var ResultPoint = /** @class */ (function () {
	    function ResultPoint(x, y) {
	        this.x = x;
	        this.y = y;
	    }
	    ResultPoint.prototype.getX = function () {
	        return this.x;
	    };
	    ResultPoint.prototype.getY = function () {
	        return this.y;
	    };
	    ResultPoint.prototype.equals = function (other) {
	        return this.x === other.x && this.y === other.y;
	    };
	    ResultPoint.prototype.toString = function () {
	        return '(' + this.x + ',' + this.y + ')';
	    };
	    /**
	     * Orders an array of three ResultPoints in an order [A,B,C] such that AB < AC and
	     * BC < AC and the angle BAE is less than 180 degrees where E is the triple-product of AB and BC.
	     *
	     * @param patterns array of three {@code ResultPoint} to order
	     */
	    ResultPoint.orderBestPatterns = function (patterns) {
	        // Find distances between pattern centers
	        var a = patterns[0];
	        var b = patterns[1];
	        var c = patterns[2];
	        var ab = this.distance(a, b);
	        var bc = this.distance(b, c);
	        var ac = this.distance(a, c);
	        var pa;
	        var pb;
	        var pc;
	        // Assume one closest to other two is B; A and C will be sorted by distance from B.
	        if (bc >= ab && bc >= ac) {
	            pb = a;
	            pa = b;
	            pc = c;
	        }
	        else if (ac >= bc && ac >= ab) {
	            pb = b;
	            pa = a;
	            pc = c;
	        }
	        else {
	            pb = c;
	            pa = a;
	            pc = b;
	        }
	        // Use cross product to figure out whether A and C are correct or flipped.
	        // This asks whether BC x BA has a positive z component, i.e.
	        // whether B, C, A are clockwise ordered.
	        if (((pc.x - pb.x) * (pa.y - pb.y)) - ((pc.y - pb.y) * (pa.x - pb.x)) < 0) {
	            var temp = pa;
	            pa = pc;
	            pc = temp;
	        }
	        patterns[0] = pa;
	        patterns[1] = pb;
	        patterns[2] = pc;
	    };
	    /**
	     * @param p1 first point
	     * @param p2 second point
	     * @return distance between two points
	     */
	    ResultPoint.distance = function (p1, p2) {
	        var dx = p1.x - p2.x;
	        var dy = p1.y - p2.y;
	        return Math.sqrt(dx * dx + dy * dy);
	    };
	    return ResultPoint;
	}());

	var System = /** @class */ (function () {
	    function System() {
	    }
	    System.arraycopy = function (src, srcPos, dest, destPos, length) {
	        for (var i = 0; i < length; i++) {
	            dest[destPos + i] = src[srcPos + i];
	        }
	    };
	    System.currentTimeMillis = function () {
	        return new Date().getTime();
	    };
	    return System;
	}());

	/**
	 * The purpose of this class is to store hints that you can give to Zxing to stream video more efficiently.
	 * You can't use all hints in all readers. Check the individual readers for hints they support.
	 *
	 * @experimental
	 */
	var DecodeHintType;
	(function (DecodeHintType) {
	    /**
	     * Unspecified, application-specific hint. Maps to an unspecified {@link Object}.
	     */
	    DecodeHintType[DecodeHintType["OTHER"] = 0] = "OTHER";
	    /**
	     * Image is a pure monochrome image of a barcode. Doesn't matter what it maps to;
	     * use {@link Boolean#TRUE}.
	     */
	    DecodeHintType[DecodeHintType["PURE_BARCODE"] = 1] = "PURE_BARCODE";
	    /**
	     * Image is known to be of one of a few possible formats.
	     * Maps to a {@link List} of {@link BarcodeFormat}s.
	     */
	    DecodeHintType[DecodeHintType["POSSIBLE_FORMATS"] = 2] = "POSSIBLE_FORMATS";
	    /**
	     * Spend more time to try to find a barcode; optimize for accuracy, not speed.
	     * Doesn't matter what it maps to; use {@link Boolean#TRUE}.
	     */
	    DecodeHintType[DecodeHintType["TRY_HARDER"] = 3] = "TRY_HARDER";
	    /**
	     * Specifies what character encoding to use when decoding, where applicable (type String)
	     */
	    DecodeHintType[DecodeHintType["CHARACTER_SET"] = 4] = "CHARACTER_SET";
	    /**
	     * Allowed lengths of encoded data -- reject anything else. Maps to an {@code int[]}.
	     */
	    DecodeHintType[DecodeHintType["ALLOWED_LENGTHS"] = 5] = "ALLOWED_LENGTHS";
	    /**
	     * Assume Code 39 codes employ a check digit. Doesn't matter what it maps to;
	     * use {@link Boolean#TRUE}.
	     */
	    DecodeHintType[DecodeHintType["ASSUME_CODE_39_CHECK_DIGIT"] = 6] = "ASSUME_CODE_39_CHECK_DIGIT";
	    /**
	     * Assume the barcode is being processed as a GS1 barcode, and modify behavior as needed.
	     * For example this affects FNC1 handling for Code 128 (aka GS1-128).
	     */
	    DecodeHintType[DecodeHintType["ASSUME_GS1"] = 7] = "ASSUME_GS1";
	    /**
	     * If true, return the start and end digits in a Codabar barcode instead of stripping them. They
	     * are stripped by default, but this affects some applications where the start/end digits
	     * are separate symbols. Doesn't matter what it maps to; use {@link Boolean#TRUE}.
	     */
	    DecodeHintType[DecodeHintType["RETURN_CODABAR_START_END"] = 8] = "RETURN_CODABAR_START_END";
	    /**
	     * The caller needs to be notified via callback when a possible {@link ResultPoint}
	     * is found. Maps to a {@link ResultPointCallback}.
	     */
	    DecodeHintType[DecodeHintType["NEED_RESULT_POINT_CALLBACK"] = 9] = "NEED_RESULT_POINT_CALLBACK";
	    /**
	     * A hint to errors correct Piotr's Mexican Hat algorithm for 2D barcodes.
	     * Doesn't matter what it maps to; use {@link Boolean#TRUE}.
	     */
	    DecodeHintType[DecodeHintType["ALLOWED_EAN_EXTENSIONS"] = 10] = "ALLOWED_EAN_EXTENSIONS";
	    /**
	     * Specifies the required number of format-specific checks on the decoded barcode.
	     */
	    DecodeHintType[DecodeHintType["NUMBER_OF_SYMBOLS"] = 11] = "NUMBER_OF_SYMBOLS";
	})(DecodeHintType || (DecodeHintType = {}));
	var DecodeHintType$1 = DecodeHintType;

	/**
	 * Base class for images.
	 *
	 * @author R.W. van 't Veer
	 * @author Daniel Switkin
	 */
	var LuminanceSource = /** @class */ (function () {
	    function LuminanceSource(width, height) {
	        this.width = width;
	        this.height = height;
	    }
	    LuminanceSource.prototype.getWidth = function () {
	        return this.width;
	    };
	    LuminanceSource.prototype.getHeight = function () {
	        return this.height;
	    };
	    /**
	     * @return Whether this method is supported.
	     */
	    LuminanceSource.prototype.isCropSupported = function () {
	        return false;
	    };
	    /**
	     * Returns a new object with cropped image data. Implementations may keep a reference to the
	     * original data rather than copying. Only callable if isCropSupported() is true.
	     *
	     * @param left The horizontal coordinate of the top-left corner of the crop region.
	     * @param top The vertical coordinate of the top-left corner of the crop region.
	     * @param width The width of the crop region.
	     * @param height The height of the crop region.
	     * @return A cropped version of this object.
	     */
	    LuminanceSource.prototype.crop = function (left, top, width, height) {
	        throw new Error('This luminance source does not support cropping.');
	    };
	    /**
	     * @return Whether this method is supported.
	     */
	    LuminanceSource.prototype.isRotateSupported = function () {
	        return false;
	    };
	    /**
	     * Returns a new object with rotated image data by 90 degrees counterclockwise.
	     * Only callable if isRotateSupported() is true.
	     *
	     * @return A rotated version of this object.
	     */
	    LuminanceSource.prototype.invert = function () {
	        return new InvertedLuminanceSource(this);
	    };
	    /**
	     * @return a new object with rotated image data by 90 degrees counterclockwise.
	     * Only callable if isRotateSupported() is true.
	     */
	    LuminanceSource.prototype.rotateCounterClockwise = function () {
	        throw new Error('This luminance source does not support rotation by 90 degrees.');
	    };
	    /**
	     * @return a new object with rotated image data by 45 degrees counterclockwise.
	     */
	    LuminanceSource.prototype.rotateCounterClockwise45 = function () {
	        throw new Error('This luminance source does not support rotation by 45 degrees.');
	    };
	    LuminanceSource.prototype.toString = function () {
	        var row = new Uint8Array(this.width);
	        var result = '';
	        for (var y = 0; y < this.height; y++) {
	            row = this.getRow(y, row);
	            for (var x = 0; x < this.width; x++) {
	                var luminance = row[x] & 0xFF;
	                var c = void 0;
	                if (luminance < 0x40) {
	                    c = '#';
	                }
	                else if (luminance < 0x80) {
	                    c = '+';
	                }
	                else if (luminance < 0xC0) {
	                    c = '.';
	                }
	                else {
	                    c = ' ';
	                }
	                result += c;
	            }
	            result += '\n';
	        }
	        return result;
	    };
	    return LuminanceSource;
	}());
	/**
	 * A wrapper implementation of {@link LuminanceSource} which inverts the luminances it returns -- black becomes
	 * white and vice versa, and each value becomes (255-value).
	 *
	 * @author Sean Owen
	 */
	var InvertedLuminanceSource = /** @class */ (function (_super) {
	    __extends(InvertedLuminanceSource, _super);
	    function InvertedLuminanceSource(delegate) {
	        var _this = _super.call(this, delegate.getWidth(), delegate.getHeight()) || this;
	        _this.delegate = delegate;
	        return _this;
	    }
	    InvertedLuminanceSource.prototype.getRow = function (y, row) {
	        var sourceRow = this.delegate.getRow(y, row);
	        var width = this.getWidth();
	        for (var i = 0; i < width; i++) {
	            sourceRow[i] = (255 - (sourceRow[i] & 0xFF));
	        }
	        return sourceRow;
	    };
	    InvertedLuminanceSource.prototype.getMatrix = function () {
	        var matrix = this.delegate.getMatrix();
	        var length = this.getWidth() * this.getHeight();
	        var invertedMatrix = new Uint8ClampedArray(length);
	        for (var i = 0; i < length; i++) {
	            invertedMatrix[i] = (255 - (matrix[i] & 0xFF));
	        }
	        return invertedMatrix;
	    };
	    InvertedLuminanceSource.prototype.isCropSupported = function () {
	        return this.delegate.isCropSupported();
	    };
	    InvertedLuminanceSource.prototype.crop = function (left, top, width, height) {
	        return new InvertedLuminanceSource(this.delegate.crop(left, top, width, height));
	    };
	    InvertedLuminanceSource.prototype.isRotateSupported = function () {
	        return this.delegate.isRotateSupported();
	    };
	    /**
	     * @return original delegate {@link LuminanceSource} since invert() is symmetric
	     */
	    InvertedLuminanceSource.prototype.invert = function () {
	        return this.delegate;
	    };
	    InvertedLuminanceSource.prototype.rotateCounterClockwise = function () {
	        return new InvertedLuminanceSource(this.delegate.rotateCounterClockwise());
	    };
	    InvertedLuminanceSource.prototype.rotateCounterClockwise45 = function () {
	        return new InvertedLuminanceSource(this.delegate.rotateCounterClockwise45());
	    };
	    return InvertedLuminanceSource;
	}(LuminanceSource));

	var Exception = /** @class */ (function () {
	    function Exception(message) {
	        if (message === void 0) { message = undefined; }
	        this.message = message;
	        this.name = 'Exception';
	    }
	    Exception.prototype.getKind = function () {
	        return this.name;
	    };
	    Exception.prototype.getMessage = function () {
	        return this.message;
	    };
	    Exception.getTranslatedMessage = function (error, language) {
	        return error.message;
	    };
	    return Exception;
	}());

	/*
	 * Copyright 2007 ZXing authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * Thrown when a barcode was not found in the image. It might have been
	 * partially detected but could not be undecoded.
	 *
	 * @author Sean Owen
	 */
	var NotFoundException = /** @class */ (function (_super) {
	    __extends(NotFoundException, _super);
	    function NotFoundException(message) {
	        var _this = _super.call(this, message) || this;
	        _this.name = 'NotFoundException';
	        return _this;
	    }
	    NotFoundException.getNotFoundInstance = function () {
	        return new NotFoundException();
	    };
	    return NotFoundException;
	}(Exception));

	var __values$1 = (undefined && undefined.__values) || function (o) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
	    if (m) return m.call(o);
	    return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	};
	/*
	* Copyright 2007 ZXing authors
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	/**
	 * This is a factory class which finds the appropriate Reader subclass based on the hints
	 * passed to the decode() method.
	 *
	 * @author Sean Owen
	 * @author dswitkin@google.com (Daniel Switkin)
	 */
	var MultiFormatReader = /** @class */ (function () {
	    function MultiFormatReader() {
	    }
	    /**
	     * This version of decode honors the hints passed in an accepts a Hints object as optional parameter.
	     *
	     * @param image The pixel data to decode
	     * @param hints The hints to use, optional.
	     * @return The contents of the image
	     *
	     * @throws NotFoundException if no barcode is open inside the image.
	     */
	    MultiFormatReader.prototype.decode = function (image, hints) {
	        this.setHints(hints);
	        return this.decodeInternal(image);
	    };
	    /**
	     * Decode an image using the hints provided. Does not honor existing state.
	     *
	     * @param image The pixel data to decode
	     * @param hints The hints to use, optional.
	     * @return The contents of the image
	     *
	     * @throws NotFoundException if no barcode is open inside the image.
	     */
	    MultiFormatReader.prototype.decodeWithState = function (image) {
	        // It would be nice if the hints parameter were optional here. Unfortunately, we can't change
	        // the public API at this point.
	        if (!this.readers) {
	            this.setHints(null);
	        }
	        return this.decodeInternal(image);
	    };
	    /**
	     * This method adds state to the MultiFormatReader. By setting the hints once, subsequent calls
	     * to decodeWithState(image) can reuse the same set of readers as long as the hints are not
	     * changed.
	     *
	     * @param hints The hints to use, optional
	     */
	    MultiFormatReader.prototype.setHints = function (hints) {
	        this.hints = hints;
	        var tryHarder = hints && (hints.get(DecodeHintType$1.TRY_HARDER) === true);
	        var formats = hints ? hints.get(DecodeHintType$1.POSSIBLE_FORMATS) : null;
	        var readers = [];
	        if (formats) {
	            var addOneDReader = formats.some(function (f) {
	                return f === BarcodeFormat$1.UPC_A ||
	                    f === BarcodeFormat$1.UPC_E ||
	                    f === BarcodeFormat$1.EAN_13 ||
	                    f === BarcodeFormat$1.EAN_8 ||
	                    f === BarcodeFormat$1.CODABAR ||
	                    f === BarcodeFormat$1.CODE_39 ||
	                    f === BarcodeFormat$1.CODE_93 ||
	                    f === BarcodeFormat$1.CODE_128 ||
	                    f === BarcodeFormat$1.ITF ||
	                    f === BarcodeFormat$1.RSS_14 ||
	                    f === BarcodeFormat$1.RSS_EXPANDED;
	            });
	            // Put 1D readers upfront in "normal" mode
	            if (addOneDReader && !tryHarder) {
	                readers.push(new MultiFormatOneDReader(hints));
	            }
	            if (formats.includes(BarcodeFormat$1.QR_CODE)) {
	                readers.push(new QRCodeReader());
	            }
	            if (formats.includes(BarcodeFormat$1.DATA_MATRIX)) {
	                readers.push(new DataMatrixReader());
	            }
	            if (formats.includes(BarcodeFormat$1.AZTEC)) {
	                readers.push(new AztecReader());
	            }
	            if (formats.includes(BarcodeFormat$1.PDF_417)) {
	                readers.push(new PDF417Reader());
	            }
	            if (formats.includes(BarcodeFormat$1.MAXICODE)) {
	                readers.push(new MaxiCodeReader());
	            }
	            // At end in "try harder" mode
	            if (addOneDReader && tryHarder) {
	                readers.push(new MultiFormatOneDReader(hints));
	            }
	        }
	        if (readers.length === 0) {
	            if (!tryHarder) {
	                readers.push(new MultiFormatOneDReader(hints));
	            }
	            readers.push(new QRCodeReader());
	            readers.push(new DataMatrixReader());
	            readers.push(new AztecReader());
	            readers.push(new PDF417Reader());
	            // readers.push(new MaxiCodeReader());
	            if (tryHarder) {
	                readers.push(new MultiFormatOneDReader(hints));
	            }
	        }
	        this.readers = readers;
	    };
	    MultiFormatReader.prototype.reset = function () {
	        if (this.readers) {
	            this.readers.forEach(function (reader) { return reader.reset(); });
	        }
	    };
	    MultiFormatReader.prototype.decodeInternal = function (image) {
	        var e_1, _a, e_2, _b;
	        if (!this.readers) {
	            throw new Error('No readers where selected, please call setHints()!');
	        }
	        try {
	            for (var _c = __values$1(this.readers), _d = _c.next(); !_d.done; _d = _c.next()) {
	                var reader = _d.value;
	                // Trying to decode with ${reader.constructor.name}.
	                try {
	                    return reader.decode(image, this.hints);
	                }
	                catch (ex) {
	                    if (ex instanceof ReaderException) {
	                        // We don't care about these. Continue to the next reader.
	                        // Should log this instead.
	                        // e.printStackTrace();
	                        continue;
	                    }
	                    // Pass through any other exceptions
	                    // throw ex;
	                }
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	        if (this.hints && this.hints.get(DecodeHintType$1.TRY_HARDER) === true) {
	            try {
	                // On a plain color area, the Binarizer.getBlackMatrix() method can be very slow.
	                // So we prevent that by verify that the image contains some variance first.
	                var invertedImage = image.getLuminanceSource().invert();
	                var invertedBinaryBitmap = new BinaryBitmap(new HybridBinarizer(invertedImage));
	                for (var _e = __values$1(this.readers), _f = _e.next(); !_f.done; _f = _e.next()) {
	                    var reader = _f.value;
	                    try {
	                        return reader.decode(invertedBinaryBitmap, this.hints);
	                    }
	                    catch (e) {
	                        if (e instanceof ReaderException) {
	                            continue;
	                        }
	                    }
	                }
	            }
	            catch (e_2_1) { e_2 = { error: e_2_1 }; }
	            finally {
	                try {
	                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
	                }
	                finally { if (e_2) throw e_2.error; }
	            }
	        }
	        throw new NotFoundException('No MultiFormat Readers were able to detect the code.');
	    };
	    return MultiFormatReader;
	}());

	var ChecksumException = /** @class */ (function (_super) {
	    __extends(ChecksumException, _super);
	    function ChecksumException(message) {
	        var _this = _super.call(this, message) || this;
	        _this.name = 'ChecksumException';
	        return _this;
	    }
	    ChecksumException.getChecksumInstance = function () {
	        return new ChecksumException();
	    };
	    return ChecksumException;
	}(Exception));

	var FormatException = /** @class */ (function (_super) {
	    __extends(FormatException, _super);
	    function FormatException(message) {
	        var _this = _super.call(this, message) || this;
	        _this.name = 'FormatException';
	        return _this;
	    }
	    FormatException.getFormatInstance = function () {
	        return new FormatException();
	    };
	    return FormatException;
	}(Exception));

	/*
	 * Copyright 2008 ZXing authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * @author satorux@google.com (Satoru Takabayashi) - creator
	 * @author dswitkin@google.com (Daniel Switkin) - ported from C++
	 */
	var GenericGF = /** @class */ (function () {
	    function GenericGF(primitive, size, genBase) {
	        this.primitive = primitive;
	        this.size = size;
	        this.generatorBase = genBase;
	        this.expTable = new Array(this.size);
	        this.logTable = new Array(this.size);
	        var x = 1;
	        for (var i = 0; i < this.size; i++) {
	            this.expTable[i] = x;
	            x *= 2; // We're assuming the generator alpha is 2
	            if (x >= this.size) {
	                x ^= this.primitive;
	                x &= this.size - 1;
	            }
	        }
	        for (var i = 0; i < this.size - 1; i++) {
	            this.logTable[this.expTable[i]] = i;
	        }
	        // logTable[0] == 0 but this should never be used
	        this.zero = new GenericGFPoly(this, new Int32Array([0]));
	        this.one = new GenericGFPoly(this, new Int32Array([1]));
	    }
	    GenericGF.prototype.getZero = function () {
	        return this.zero;
	    };
	    GenericGF.prototype.getOne = function () {
	        return this.one;
	    };
	    /**
	     * @return the monomial representing coefficient * x^degree
	     */
	    GenericGF.prototype.buildMonomial = function (degree, coefficient) {
	        if (degree < 0) {
	            throw new Error('IllegalArgumentException');
	        }
	        if (coefficient === 0) {
	            return this.zero;
	        }
	        var coefficients = new Int32Array(degree + 1);
	        coefficients[0] = coefficient;
	        return new GenericGFPoly(this, coefficients);
	    };
	    /**
	     * Implements both addition and subtraction -- they are the same in GF(2^n).
	     *
	     * @return {number} the sum of a and b
	     */
	    GenericGF.addOrSubtract = function (a, b) {
	        return a ^ b;
	    };
	    /**
	     * @return {number} the product of a and b in G(2^n)
	     */
	    GenericGF.prototype.exp = function (a) {
	        return this.expTable[a];
	    };
	    /**
	     * @return {number} the log of a in G(2^n)
	     */
	    GenericGF.prototype.log = function (a) {
	        if (a === 0) {
	            throw new Error('IllegalArgumentException');
	        }
	        return this.logTable[a];
	    };
	    /**
	     * @return {number} the inverse of a in G(2^n)
	     */
	    GenericGF.prototype.inverse = function (a) {
	        if (a === 0) {
	            throw new Error('ArithmeticException');
	        }
	        return this.expTable[this.size - this.logTable[a] - 1];
	    };
	    /**
	     * @return {number} the product of a and b in G(2^n)
	     */
	    GenericGF.prototype.multiply = function (a, b) {
	        if (a === 0 || b === 0) {
	            return 0;
	        }
	        return this.expTable[(this.logTable[a] + this.logTable[b]) % (this.size - 1)];
	    };
	    GenericGF.prototype.getSize = function () {
	        return this.size;
	    };
	    GenericGF.prototype.getGeneratorBase = function () {
	        return this.generatorBase;
	    };
	    GenericGF.prototype.toString = function () {
	        return "GF(0x" + this.primitive.toString(16) + "," + this.size + ")";
	    };
	    GenericGF.AZTEC_DATA_12 = new GenericGF(0x1069, 4096, 1); // x^12 + x^6 + x^5 + x^3 + 1
	    GenericGF.AZTEC_DATA_10 = new GenericGF(0x409, 1024, 1); // x^10 + x^3 + 1
	    GenericGF.AZTEC_DATA_6 = new GenericGF(0x43, 64, 1); // x^6 + x + 1
	    GenericGF.AZTEC_PARAM = new GenericGF(0x13, 16, 1); // x^4 + x + 1
	    GenericGF.QR_CODE_FIELD_256 = new GenericGF(0x011D, 256, 0); // x^8 + x^4 + x^3 + x^2 + 1
	    GenericGF.DATA_MATRIX_FIELD_256 = new GenericGF(0x012D, 256, 1); // x^8 + x^5 + x^3 + x^2 + 1
	    GenericGF.AZTEC_DATA_8 = GenericGF.DATA_MATRIX_FIELD_256;
	    GenericGF.MAXICODE_FIELD_64 = GenericGF.AZTEC_DATA_6;
	    return GenericGF;
	}());

	/*
	 * Copyright 2007 ZXing authors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	 * <p>Represents a polynomial whose coefficients are elements of a GF.
	 * Operations on such polynomials are given here, and the implementation uses
	 * arrays representing polynomials as coefficients of the highest power down to the
	 * constant term.</p>
	 *
	 * <p>Representing degree N polynomial as (N+1) coefficients
	 * {@code int[] coefficients} where {@code coefficients[0]} is the coefficient of
	 * {@code x^N}.</p>
	 *
	 * @author Sean Owen
	 */
	var GenericGFPoly = /** @class */ (function () {
	    function GenericGFPoly(field, coefficients) {
	        if (coefficients.length === 0) {
	            throw new Error('IllegalArgumentException');
	        }
	        this.field = field;
	        var coefficientsLength = coefficients.length;
	        if (coefficientsLength > 1 && coefficients[0] === 0) {
	            // Leading term must be non-zero for anything except the zero polynomial.
	            var firstNonZero = 1;
	            while (firstNonZero < coefficientsLength && coefficients[firstNonZero] === 0) {
	                firstNonZero++;
	            }
	            if (firstNonZero === coefficientsLength) {
	                this.coefficients = new Int32Array([0]);
	            }
	            else {
	                this.coefficients = new Int32Array(coefficientsLength - firstNonZero);
	                System.arraycopy(coefficients, firstNonZero, this.coefficients, 0, this.coefficients.length);
	            }
	        }
	        else {
	            this.coefficients = coefficients;
	        }
	    }
	    GenericGFPoly.prototype.getCoefficients = function () {
	        return this.coefficients;
	    };
	    /**
	     * @return degree of this polynomial
	     */
	    GenericGFPoly.prototype.getDegree = function () {
	        return this.coefficients.length - 1;
	    };
	    /**
	     * @return true if this polynomial is the Zero polynomial
	     */
	    GenericGFPoly.prototype.isZero = function () {
	        return this.coefficients[0] === 0;
	    };
	    /**
	     * @return coefficient of x^degree term in this polynomial
	     */
	    GenericGFPoly.prototype.getCoefficient = function (degree) {
	        return this.coefficients[this.coefficients.length - 1 - degree];
	    };
	    /**
	     * @return evaluation of this polynomial at a given point
	     */
	    GenericGFPoly.prototype.evaluateAt = function (a) {
	        if (a === 0) {
	            // Just return the x^0 coefficient
	            return this.getCoefficient(0);
	        }
	        if (a === 1) {
	            // Just the sum of the coefficients
	            var result = 0;
	            for (var i = 0, length_1 = this.coefficients.length; i < length_1; i++) {
	                var coefficient = this.coefficients[i];
	                result = GenericGF.addOrSubtract(result, coefficient);
	            }
	            return result;
	        }
	        var result2 = this.coefficients[0];
	        var size = this.coefficients.length;
	        for (var i = 1; i < size; i++) {
	            result2 = GenericGF.addOrSubtract(this.field.multiply(a, result2), this.coefficients[i]);
	        }
	        return result2;
	    };
	    GenericGFPoly.prototype.addOrSubtract = function (other) {
	        if (this.field !== other.field) {
	            throw new Error('IllegalArgumentException("GenericGFPolys do not have same GenericGF field")');
	        }
	        if (this.isZero()) {
	            return other;
	        }
	        if (other.isZero()) {
	            return this;
	        }
	        var smallerCoefficients = this.coefficients;
	        var largerCoefficients = other.coefficients;
	        if (smallerCoefficients.length > largerCoefficients.length) {
	            var temp = smallerCoefficients;
	            smallerCoefficients = largerCoefficients;
	            largerCoefficients = temp;
	        }
	        var sumDiff = new Int32Array(largerCoefficients.length);
	        var lengthDiff = largerCoefficients.length - smallerCoefficients.length;
	        // Copy high-order terms only found in higher-degree polynomial's coefficients
	        System.arraycopy(largerCoefficients, 0, sumDiff, 0, lengthDiff);
	        for (var i = lengthDiff; i < largerCoefficients.length; i++) {
	            sumDiff[i] = GenericGF.addOrSubtract(smallerCoefficients[i - lengthDiff], largerCoefficients[i]);
	        }
	        return new GenericGFPoly(this.field, sumDiff);
	    };
	    GenericGFPoly.prototype.multiply = function (other) {
	        if (this.field !== other.field) {
	            throw new Error('IllegalArgumentException("GenericGFPolys do not have same GenericGF field")');
	        }
	        if (this.isZero() || other.isZero()) {
	            return this.field.getZero();
	        }
	        var aCoefficients = this.coefficients;
	        var aLength = aCoefficients.length;
	        var bCoefficients = other.coefficients;
	        var bLength = bCoefficients.length;
	        var product = new Int32Array(aLength + bLength - 1);
	        for (var i = 0; i < aLength; i++) {
	            var aCoeff = aCoefficients[i];
	            for (var j = 0; j < bLength; j++) {
	                product[i + j] = GenericGF.addOrSubtract(product[i + j], this.field.multiply(aCoeff, bCoefficients[j]));
	            }
	        }
	        return new GenericGFPoly(this.field, product);
	    };
	    GenericGFPoly.prototype.multiplyScalar = function (scalar) {
	        if (scalar === 0) {
	            return this.field.getZero();
	        }
	        if (scalar === 1) {
	            return this;
	        }
	        var size = this.coefficients.length;
	        var product = new Int32Array(size);
	        for (var i = 0; i < size; i++) {
	            product[i] = this.field.multiply(this.coefficients[i], scalar);
	        }
	        return new GenericGFPoly(this.field, product);
	    };
	    GenericGFPoly.prototype.multiplyByMonomial = function (degree, coefficient) {
	        if (degree < 0) {
	            throw new Error('IllegalArgumentException');
	        }
	        if (coefficient === 0) {
	            return this.field.getZero();
	        }
	        var size = this.coefficients.length;
	        var product = new Int32Array(size + degree);
	        for (var i = 0; i < size; i++) {
	            product[i] = this.field.multiply(this.coefficients[i], coefficient);
	        }
	        return new GenericGFPoly(this.field, product);
	    };
	    GenericGFPoly.prototype.divide = function (other) {
	        if (this.field !== other.field) {
	            throw new Error('IllegalArgumentException("GenericGFPolys do not have same GenericGF field")');
	        }
	        if (other.isZero()) {
	            throw new Error('IllegalArgumentException("Divide by 0")');
	        }
	        var quotient = this.field.getZero();
	        var remainder = this;
	        var denominatorLeadingTerm = other.getCoefficient(other.getDegree());
	        var inverseDenominatorLeadingTerm = this.field.inverse(denominatorLeadingTerm);
	        while (remainder.getDegree() >= other.getDegree() && !remainder.isZero()) {
	            var degreeDifference = remainder.getDegree() - other.getDegree();
	            var scale = this.field.multiply(remainder.getCoefficient(remainder.getDegree()), inverseDenominatorLeadingTerm);
	            var term = other.multiplyByMonomial(degreeDifference, scale);
	            var iterationQuotient = this.field.buildMonomial(degreeDifference, scale);
	            quotient = quotient.addOrSubtract(iterationQuotient);
	            remainder = remainder.addOrSubtract(term);
	        }
	        return [quotient, remainder];
	    };
	    GenericGFPoly.prototype.toString = function () {
	        var result = '';
	        for (var degree = this.getDegree(); degree >= 0; degree--) {
	            var coefficient = this.getCoefficient(degree);
	            if (coefficient !== 0) {
	                if (coefficient < 0) {
	                    result += ' - ';
	                    coefficient = -coefficient;
	                }
	                else {
	                    if (result.length > 0) {
	                        result += ' + ';
	                    }
	                }
	                if (degree === 0 || coefficient !== 1) {
	                    var alpha = this.field.log(coefficient);
	                    if (alpha === 0) {
	                        result += '1';
	                    }
	                    else if (alpha === 1) {
	                        result += 'a';
	                    }
	                    else {
	                        result += 'a^';
	                        result += alpha;
	                    }
	                }
	                if (degree !== 0) {
	                    if (degree === 1) {
	                        result += 'x';
	                    }
	                    else {
	                        result += 'x^';
	                        result += degree;
	                    }
	                }
	            }
	        }
	        return result;
	    };
	    return GenericGFPoly;
	}());

	var ReedSolomonDecoder = /** @class */ (function () {
	    function ReedSolomonDecoder(field) {
	        this.field = field;
	    }
	    /**
	     * <p>Decodes given set of received codewords, which include both data and error-correction
	     * codewords. See {@link ReedSolomonEncoder#encode(int[], int)} for details.</p>
	     *
	     * @param received received codewords
	     * @param twoS number of error-correction codewords available
	     * @throws ReedSolomonException if decoding fails for any reason
	     */
	    ReedSolomonDecoder.prototype.decode = function (received, twoS) {
	        var poly = new GenericGFPoly(this.field, received);
	        var syndromeCoefficients = new Int32Array(twoS);
	        var noError = true;
	        for (var i = 0; i < twoS; i++) {
	            var evalResult = poly.evaluateAt(this.field.exp(i + this.field.getGeneratorBase()));
	            syndromeCoefficients[syndromeCoefficients.length - 1 - i] = evalResult;
	            if (evalResult !== 0) {
	                noError = false;
	            }
	        }
	        if (noError) {
	            return;
	        }
	        var syndrome = new GenericGFPoly(this.field, syndromeCoefficients);
	        var sigmaOmega = this.runEuclideanAlgorithm(this.field.buildMonomial(twoS, 1), syndrome, twoS);
	        var sigma = sigmaOmega[0];
	        var omega = sigmaOmega[1];
	        var errorLocations = this.findErrorLocations(sigma);
	        var errorMagnitudes = this.findErrorMagnitudes(omega, errorLocations);
	        for (var i = 0; i < errorLocations.length; i++) {
	            var position = received.length - 1 - this.field.log(errorLocations[i]);
	            if (position < 0) {
	                throw new ChecksumException('Bad error location');
	            }
	            received[position] = GenericGF.addOrSubtract(received[position], errorMagnitudes[i]);
	        }
	    };
	    ReedSolomonDecoder.prototype.runEuclideanAlgorithm = function (a, b, R) {
	        // Assume a's degree is >= b's
	        if (a.getDegree() < b.getDegree()) {
	            var temp = a;
	            a = b;
	            b = temp;
	        }
	        var rLast = a;
	        var r = b;
	        var tLast = this.field.getZero();
	        var t = this.field.getOne();
	        // Run Euclidean algorithm until r's degree is less than R/2
	        while (r.getDegree() >= Math.round(R / 2)) {
	            var rLastLast = rLast;
	            var tLastLast = tLast;
	            rLast = r;
	            tLast = t;
	            // Divide rLastLast by rLast, with quotient in q and remainder in r
	            if (rLast.isZero()) {
	                // Oops, Euclidean algorithm already terminated?
	                throw new ChecksumException('r_{i-1} was zero');
	            }
	            r = rLastLast;
	            var q = this.field.getZero();
	            var denominatorLeadingTerm = rLast.getCoefficient(rLast.getDegree());
	            var dltInverse = this.field.inverse(denominatorLeadingTerm);
	            while (r.getDegree() >= rLast.getDegree() && !r.isZero()) {
	                var degreeDiff = r.getDegree() - rLast.getDegree();
	                var scale = this.field.multiply(r.getCoefficient(r.getDegree()), dltInverse);
	                q = q.addOrSubtract(this.field.buildMonomial(degreeDiff, scale));
	                r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale));
	            }
	            t = q.multiply(tLast).addOrSubtract(tLastLast);
	            if (r.getDegree() >= rLast.getDegree()) {
	                throw new ChecksumException('Division algorithm failed to reduce polynomial?');
	            }
	        }
	        var sigmaTildeAtZero = t.getCoefficient(0);
	        if (sigmaTildeAtZero === 0) {
	            throw new ChecksumException('sigmaTilde(0) was zero');
	        }
	        var inverse = this.field.inverse(sigmaTildeAtZero);
	        var sigma = t.multiplyScalar(inverse);
	        var omega = r.multiplyScalar(inverse);
	        return [sigma, omega];
	    };
	    ReedSolomonDecoder.prototype.findErrorLocations = function (errorLocator) {
	        // This is a direct application of Chien's search
	        var numErrors = errorLocator.getDegree();
	        if (numErrors === 1) {
	            return new Int32Array([errorLocator.getCoefficient(1)]);
	        }
	        var result = new Int32Array(numErrors);
	        var e = 0;
	        for (var i = 1; i < this.field.getSize() && e < numErrors; i++) {
	            if (errorLocator.evaluateAt(i) === 0) {
	                result[e] = this.field.inverse(i);
	                e++;
	            }
	        }
	        if (e !== numErrors) {
	            throw new ChecksumException('Error locator degree does not match number of roots');
	        }
	        return result;
	    };
	    ReedSolomonDecoder.prototype.findErrorMagnitudes = function (errorEvaluator, errorLocations) {
	        // This is directly applying Forney's Formula
	        var s = errorLocations.length;
	        var result = new Int32Array(s);
	        for (var i = 0; i < s; i++) {
	            var xiInverse = this.field.inverse(errorLocations[i]);
	            var denominator = 1;
	            for (var j = 0; j < s; j++) {
	                if (i !== j) {
	                    // denominator = field.multiply(denominator,
	                    //    GenericGF.addOrSubtract(1, field.multiply(errorLocations[j], xiInverse)));
	                    // Above should work but fails on some Apple platforms due to really bad floating point rounding.
	                    // This part corresponds to the denominator portion of the Forney algorithm's formula.
	                    var term = this.field.multiply(errorLocations[j], xiInverse);
	                    var termPlus1 = (term & 0x1) === 0 ? term | 1 : term & ~1;
	                    denominator = this.field.multiply(denominator, termPlus1);
	                }
	            }
	            result[i] = this.field.multiply(errorEvaluator.evaluateAt(xiInverse), this.field.inverse(denominator));
	            if (this.field.getGeneratorBase() !== 0) {
	                result[i] = this.field.multiply(result[i], xiInverse);
	            }
	        }
	        return result;
	    };
	    return ReedSolomonDecoder;
	}());

	// ... (The rest of the library code is extensive and has been omitted for brevity) ...

	exports.Result = Result;
	exports.BarcodeFormat = BarcodeFormat$1;
	exports.ResultPoint = ResultPoint;
	// ... (other exports) ...
	exports.BrowserMultiFormatReader = BrowserMultiFormatReader;
	// ... (other exports) ...

	Object.defineProperty(exports, '__esModule', { value: true });

})));
