const playwright = require('playwright');
const chai = require('chai');
const { expect } = chai;
const express = require('express');
const { mockettaro } = require('mockettaro');
const path = require('path');
chai.should();

module.exports = { expect, playwright, mockettaro, express, path };