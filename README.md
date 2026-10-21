# Topcoder Bus API Server 

## Overview 

A meta service, Topcoder Bus API server provides information about other services offered by Topcoder.

This server was generated initially by the [swagger-codegen](https://github.com/swagger-api/swagger-codegen) project. We then copied over changes that existed in the older version over to version 5

## Requirements

Nodejs: Version ~8

## Configuration

The following Kafka configurations must be set in the environment variables:

- `KAFKA_URL` the Kafka url
- `KAFKA_CLIENT_CERT` the SSL client cert, can be string or file path
- `KAFKA_CLIENT_CERT_KEY` the SSL client cert key, can be string or file path

Example:

```bash
export KAFKA_URL="kafka+ssl://ec2-34-205-227-216.compute-1.amazonaws.com:9096,kafka+ssl://ec2-34-233-75-247.compute-1.amazonaws.com:9096,kafka+ssl://ec2-34-198-118-170.compute-1.amazonaws.com:9096,kafka+ssl://ec2-34-231-150-104.compute-1.amazonaws.com:9096,kafka+ssl://ec2-34-233-209-20.compute-1.amazonaws.com:9096,kafka+ssl://ec2-34-233-131-252.compute-1.amazonaws.com:9096,kafka+ssl://ec2-52-205-198-73.compute-1.amazonaws.com:9096,kafka+ssl://ec2-52-4-109-80.compute-1.amazonaws.com:9096"

export KAFKA_CLIENT_CERT="-----BEGIN CERTIFICATE-----
MIIDQzCCAiugAwIBAgIBADANBgkqhkiG9w0BAQsFADAyMTAwLgYDVQQDDCdjYS1j
YmJiNGVkZi1mNDFhLTRjNzMtYTg5OC01NDYyMjhkNmQyNDIwHhcNMTcwOTI3MDUw
MTIyWhcNMjcwOTI3MDUwMTIyWjAZMRcwFQYDVQQDDA51ODFvcjFsdTl2dTB1bzCC
ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKjkcV/BXD13Q09bRKohN/sK
iDMGFA2QZ57TGd7svX7iZQIk9HmXEPd5zCTHZ6nZBbcGDQ9P+zGlJIGZQuRVKLOn
ZPilaeUHRGrvCWGJZ6lVPNqInC1STHTfFJhcUNMG6qaD2ayBAw16f13vD1wGEWCm
/DRfvrjIp3JIetGdKctmdiGLYH7CQecRW88Czx9e3Vpl1nxGcNAPDDCj0nRwuPse
fVrg5onPX355om+Ct/teSeSONhio4dFL3fwl47CXFCReZFYOrBoLexfHXHumJ/Kp
TQW+k056hhoagykcpTf8uNjxNRalDPkw7ngt+1IzatbhOacea1/WUE1444eEak8C
AwEAAaN9MHswHQYDVR0OBBYEFJJzd6OZVLthBkhVZEW42CR8NJbtMFoGA1UdIwRT
MFGAFORcypfrQ0tfS5tyBdv89jfpZEMaoTakNDAyMTAwLgYDVQQDDCdjYS1jYmJi
NGVkZi1mNDFhLTRjNzMtYTg5OC01NDYyMjhkNmQyNDKCAQAwDQYJKoZIhvcNAQEL
BQADggEBALVAdOWXdnSqhucXHjpIf0lxlH6WhzhhlctLCreSf+/7y6pPVpWSVIEl
seVxOE5tsO2OzdtGgN2t7rr6bHuakL5rk9rH06r1jYAVQBR+T6SSLFbSVzl4Q5TO
b+T9/sHx5QtXSYgMh4FhZcBjrmDmWvpd42Y4MPfjLTqTP8RWHHib8E4/FYS9txk6
WoxrKcgnm/RmOcFWrjNjgm6JJprO1BSnbc2i/Rs5rxG2tRTTmXp6d7QCRa0bdhKz
yETgcStnaVvyh64zhls3xXBm06rvpu2wwo6QHcPeekvQwxQvb63oovD8b+pFJri+
6MBSQE4TtQenlVx7Ksy9UdNmU21xCYU=
-----END CERTIFICATE-----"

export KAFKA_CLIENT_CERT_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAqORxX8FcPXdDT1tEqiE3+wqIMwYUDZBnntMZ3uy9fuJlAiT0
eZcQ93nMJMdnqdkFtwYND0/7MaUkgZlC5FUos6dk+KVp5QdEau8JYYlnqVU82oic
LVJMdN8UmFxQ0wbqpoPZrIEDDXp/Xe8PXAYRYKb8NF++uMinckh60Z0py2Z2IYtg
fsJB5xFbzwLPH17dWmXWfEZw0A8MMKPSdHC4+x59WuDmic9ffnmib4K3+15J5I42
GKjh0Uvd/CXjsJcUJF5kVg6sGgt7F8dce6Yn8qlNBb6TTnqGGhqDKRylN/y42PE1
FqUM+TDueC37UjNq1uE5px5rX9ZQTXjjh4RqTwIDAQABAoIBAEGCOid2DJ0awVTq
hbunntsUvrdryCNqu4ZzQzmgge/RSHSIePsgiUg0SeaKIb9Tmk/fXPlvgHNFJt/N
3pBKJ7tnVlbLckOPig4gIXdfoIGhujTZgBpkLZu3W3mtdPwlVqa3xZqPf+uedACv
VTnQcLUYkAKQkJ2D1s8RJfJgD3IA7nbZkzjVdUFdpl5m2Rijs3oLvVYVsAJBSsJK
AjGWobf9pgvXhUnBxmtWKEYsnrAwNF8j+uXo8uTXZj6KMWSmKMI5urykKw/LiSk3
u0IsweCE2cqtTgP3Os5b+au/SVNfFlNOLlic/XX3Z28AvupfuoNWx30VpUsqFBE8
LQEG9EECgYEA3Z6QJKcdMmETN6C0+nMAqdibqMv4su3dmfW3M3Hw4IH/pdsQ7aOa
tn2w01BxYaYfaPjN4cksmJnYLyAHp3D8nxopKtYnS+ky162Wya1ETowjd5+0X0Lq
tMGATPzqcysVt+OO+stRuTkLKXy0OANH1OCEhzlPtFEbYDmKt6srRAkCgYEAwxfe
Ky5eJB63sEkUg0QbXsDr5to1RMrvxjmWVF51LXHBSJl/UFde6l8fOHVtDbG08XGR
lIsQ4f4vsbNOiR7bim0opYPxcxWCD13GBP1u0eUbBPpU4ac0JT12uMYRg9bB7RMl
3eWJU3qmddeAOq0oCsC7aimEFih6QCr4TNcxQZcCgYBddrzFqHDIyWXoZO9OXGfg
OYjUNEmLdIOrpZQAr0Ht/QVK9kt6XTAnXHTRebCHhR7kD2IMoeIb7W3d2f1AYYc4
tji8ZxqlihC2IvBf16HiGnnuvjy8nCUN3Dl2vodF0NrU9bRcEplBq0wI0B3VLZUC
szlRKhtyKW6JM1tMQHT7uQKBgEOP+Hirzh5kJOj/5gKvi2r9FLUVzGzOessDFnSR
YbMjOfSSc+y21UAFQSKkR+f+KtOSqP/wSSB6jrnThtclwJHny7PGRc+9GxWHPBRu
T/qQhRLsPokHBp/+8SZ8MYSe0vnvL6Xw3+XxC8SzpMytOri+lijlx8CEtBGUz/iM
bZpxAoGAEnJFUEGCB1ta3RQpI5L4nH2Rex0Avv8rkXGK2T/t5z2h8Ujg4WW3J7DD
Jp8xItVz3sqz5aCg+EvcewSGZ18AC+9cbxrbI2I83jQDHw+DQmVUyR6rl5+r+S6O
69wdZ08Y/jYkltb5PbhPqs0Kfr86cUqBuKEptRtto6Wto3k/Za4=
-----END RSA PRIVATE KEY-----"
```

## Other Configurations

The other configurations can be changed in `config/default.js` or by setting environment variables.

- `LOG_LEVEL` the logging level. Default is `info`. Supported levels include `error`, `warn`, `info`, and `debug`.
- `PORT` the port on that app listens
- `API_VERSION` the api version
- `AUTH_SECRET` the member JWT secret (`JWT_TOKEN_SECRET` is retained as an explicit alias)
- `TC_EMAIL_URL` the email service URL (http://localhost:4001, if deployed locally)
- `KEYCLOAK_CLIENT_ID` / `KEYCLOAK_CLIENT_SECRET` dedicated credentials for outbound placeholder lookup
- `TC_EMAIL_CACHE_PERIOD` the period to cache template placeholders from email service (60 min default)

## Deploying the server

To deploy the server locally, run:

```bash
npm install
npm start
```

To view the Swagger UI interface visit `http://localhost:3000/docs`

This project leverages the mega-awesome [swagger-tools](https://github.com/apigee-127/swagger-tools) middleware which does most all the work.

## Keycloak migration branch

`keycloak_m2M` pins shared core 4.0.0-keycloak.0 at
`c262f4aca971904f308085bdeaaed35cdf3cfa7d`. Run `nvm use` (Node 22.23.2).
Configure `M2M_PROVIDER=keycloak`, `KEYCLOAK_ISSUER`, `KEYCLOAK_AUDIENCE`,
`KEYCLOAK_TOKEN_URL`, and credentials when outbound template lookup is used.
`KEYCLOAK_SCOPE` optionally requests grants. Issuance uses the managed HTTPS
endpoint with no Auth0 fallback; all verification delegates to shared core.

Bus events require service scope `write:bus_api`; GET/HEAD topics require
`read:bus_topics`; placeholder-cache clearing requires `write:bus_api`.
The Swagger `x-required-scope` metadata is enforced centrally, including HEAD.
Members cannot substitute role/scope claims for machine grants. Legacy unscoped
catalog/payload stub operations remain member-only. The normalized principal is
stored in `req.swagger.params.authUser`; no namespace substring matching or
synthetic member identity is used. Invalid JWTs return 401; missing grants 403.

For legacy member sessions explicitly configure `AUTH_SECRET` (or its existing
`JWT_TOKEN_SECRET` alias), `VALID_ISSUERS` as a JSON array, and
`AUTH_USER_AUDIENCES` as a JSON array or `ALLOW_LEGACY_USER_AUDIENCE=true`.
`verifyJwtToken` now returns a Promise for the same common validation contract;
there are no runtime callers of that legacy helper in this repository.

`npm run lint`, `npm run build` (runtime JavaScript syntax), and `npm test`
validate this branch without Kafka publication or downstream writes. Configure
dedicated Keycloak values before later rollout. CI excludes `keycloak_m2M`;
existing DEV Bus services remain undeployed by this work.
