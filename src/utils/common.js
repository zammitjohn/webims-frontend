import { toast } from 'react-toastify'
import packageJson from '../../package.json';

export function downloadCSVFile(url, id, filename) {
    fetch(`${packageJson.apihost}${url}?id=${id}`, {
        headers: {
            'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
        },
        method: 'GET'
    })
    .then(response => response.blob())
    .then(blob => {
        if (blob.size) {
            toast.info("Downloading");
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.csv`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove(); //afterwards we remove the element again   
        } else {
            toast.warning("Nothing to download!");
        }
    },
    (error) => {
        toast.error("Error occured");
        console.log(error);
    });
}