function generateRecoveryCodes() {

  const codes = []

  for (let i = 0; i < 8; i++) {

    const code = Math.random()
      .toString(36)
      .substring(2,10)
      .toUpperCase();

    codes.push({
      code,
      used:false
    });

  }

  return codes;
}
export default generateRecoveryCodes;