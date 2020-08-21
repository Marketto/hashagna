const playwright = require('playwright');
const chai = require('chai');
const { expect } = chai;
const express = require('express');
const path = require('path');
chai.should();

module.exports = { expect, playwright, express, path };