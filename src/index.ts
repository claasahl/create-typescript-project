#!/usr/bin/env node
import execa from "execa";

execa("echo", ["hello world"]).stdout.pipe(process.stdout);
