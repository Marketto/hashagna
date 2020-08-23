import playwright from 'playwright';
import chai from 'chai';
import express from 'express';
import path from 'path';
import crypto from 'crypto';
const cryptoMd5 = (plainStr: string) => crypto.createHash('md5').update(plainStr).digest("hex") as string;

const { expect } = chai;
chai.should();

export { expect, playwright, express, path, cryptoMd5 };