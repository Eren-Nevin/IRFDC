export async function sendTransaction(address: string, amount: string) {
    let res: Response = await fetch('http://localhost:3000?' + new URLSearchParams({ address: address, amount: amount }), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return true;
}
