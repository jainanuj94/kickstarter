import {Button, Snackbar, TableCell, TableRow} from "@mui/material";
import web3 from "../ethereum/web3.js";
import Campaign from "../ethereum/campaign.js";
import {useState} from "react";
import {useRouter} from "next/router.js";


const RequestRow = ({request, index, approversCount, contractAddress}) => {
    const [approveLoading, setApproveLoading] = useState(false)
    const [finalizeLoading, setFinalizeLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const readyToFinalize = request.approvalCount > approversCount / 2;

    const router = useRouter();

    console.log(request.complete)
    const onApprove = async () => {
        setApproveLoading(true)
        setErrorMessage('')
        const accounts = await web3.eth.getAccounts();
        const campaign = await Campaign(contractAddress);
        try {
            await campaign.methods.approveRequest(index).send({
                from: accounts[0]
            })
            router.reload()
        } catch (err) {
            setErrorMessage(err.message)
        }
        setApproveLoading(false)
    }

    const onFinalize = async () => {
        setFinalizeLoading(true)
        setErrorMessage('')
        const accounts = await web3.eth.getAccounts();
        const campaign = await Campaign(contractAddress);
        try {
            await campaign.methods.finalizeRequest(index).send({
                from: accounts[0]
            })
            router.reload()
        } catch (err) {
            setErrorMessage(err.message)
        }
        setFinalizeLoading(false)
    }

    return (
        <>
            <TableRow key={index}
                      sx={{
                          opacity: request.complete ? 0.5 : 1,
                          pointerEvents: request.complete ? "none" : "auto",
                          backgroundColor: request.complete ? "#f0f0f0" : readyToFinalize ? "#AAF0C9" : "inherit",
                      }}>
                <TableCell component="th" scope="row">{index + 1}</TableCell>
                <TableCell component="th" scope="row">{request.description}</TableCell>
                <TableCell align="center">{web3.utils.fromWei(request.value, 'ether')}</TableCell>
                <TableCell align="center">{request.recipient}</TableCell>
                <TableCell align="center">{request.approvalCount}/{approversCount}</TableCell>
                <TableCell align="center">
                    {
                        request.complete ? null : (
                            <Button sx={{color: 'green'}}
                                    onClick={onApprove}>{approveLoading ? 'Approving...' : 'Approve'}</Button>
                        )
                    }
                </TableCell>
                <TableCell align="center">
                    {
                        request.complete ? null :
                            (<Button sx={{color: 'blue'}}
                                     onClick={onFinalize}>{finalizeLoading ? 'Finalizing...' : 'Finalize'}</Button>)

                    }
                </TableCell>
            </TableRow>
            {errorMessage && (
                <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    message={errorMessage}
                />
            )}
        </>
    );
}

export default RequestRow;