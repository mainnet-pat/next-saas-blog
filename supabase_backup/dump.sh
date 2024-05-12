#!/bin/bash

docker run --rm -it postgres pg_dump -s -d postgres://postgres.lrmfxhevtqffddrhwwlm:${SUPABASE_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres > dump.sql