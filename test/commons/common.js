const playwright = require('playwright');
const chai = require('chai');
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const cryptoMd5 = plainStr => crypto.createHash('md5').update(plainStr).digest("hex");
const { expect } = chai;
chai.should();

module.exports = { expect, playwright, express, path, cryptoMd5 };