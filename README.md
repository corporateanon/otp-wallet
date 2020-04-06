# otp-wallet

Simple command-line util to manage Google Authenticator keys

## Installation

```
npm -g install otp-wallet
```

## Usage

```
otp-wallet --help
```

Add a key interactively:

```
otp-wallet add
```

Add a key directly:

```
otp-wallet add MYKEY0001 key_name 
```

List tokens with countdown:

```
otp-wallet
```

List tokens once:

```
otp-wallet once
```

Delete keys:

```
otp-wallet delete key1_name key2_name...
```

Delete keys interactively:

```
otp-wallet delete
```
