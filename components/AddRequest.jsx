import {Alert, Button, FormControl, FormHelperText, TextField} from "@mui/material";
import web3 from "../ethereum/web3.js";
import Campaign from "../ethereum/campaign.js";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {useRouter} from "next/router.js";

const AddRequest = ({contractAddress}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();

    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const onSubmit = async (data) => {
        setLoading(true)
        setErrorMessage('');
        const accounts = await web3.eth.getAccounts();
        const campaign = await Campaign(contractAddress);
        try {
            await campaign.methods.createRequest(
                data.description,
                web3.utils.toWei(data.value,'ether'),
                data.recipient
            ).send({
                from: accounts[0]
            })
            router.push(`/campaigns/${contractAddress}/requests`)
        } catch (e) {
            setErrorMessage(e.message);
        }
        setLoading(false);
        reset();
    }

    return (
        <form style={{width: '100%'}} onSubmit={handleSubmit(onSubmit)}>
            <FormControl variant="standard" sx={{ width: '100%', margin: 2 }}>
                <TextField
                    sx={{ margin: 2 }}
                    label={"Description"}
                    disabled={loading}
                    {...register("description",
                        {required: true}
                    )
                    }
                />
                <TextField
                    sx={{ margin: 2 }}
                    label={"Value in Ether"}
                    disabled={loading}
                    inputProps={{
                        inputMode: 'decimal', // To ensure decimal keypad on mobile devices
                    }}
                    {...register("value",
                        {
                            required: true,
                            pattern: {
                                value: /^\d*\.?\d*$/,
                                message: "Only positive numbers are allowed",
                            },
                            validate: (value) => value === "" || parseFloat(value) >= 0 || "The number must be positive",
                        }
                        )
                    }
                />
                <TextField
                    sx={{ margin: 2 }}
                    label={"Recipient Address"}
                    disabled={loading}
                    {...register("recipient",
                        {required: true}
                    )
                    }
                />
            </FormControl>
            {errors.description && (
                <FormHelperText>{errors.description.message}</FormHelperText>
            )}
            {errors.value && (
                <FormHelperText>{errors.value.message}</FormHelperText>
            )}
            {errors.recipient && (
                <FormHelperText>{errors.recipient.message}</FormHelperText>
            )}
            <br/>
            {errorMessage && (<Alert severity="error">{errorMessage}</Alert>)}
            <br/>
            <Button sx={{ margin: 2 }} disabled={loading} type="submit">
                {loading ? "Creating..." : "Create"}
            </Button>
        </form>
    );
}

export default AddRequest;