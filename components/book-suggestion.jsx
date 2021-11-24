import {
    Alert, AlertIcon,
    Box,
    Button, FormControl, FormHelperText, FormLabel, Input,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import {FiMessageCircle} from "react-icons/fi";
import {useState} from "react";

const BookSuggestion = () => {

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitSuggestion = async event => {
        event.preventDefault();

        setIsSubmitting(true);
        setIsSubmitSuccessful(false);

        const res = await fetch("/api/send-suggestion", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: event.target.title.value,
                author: event.target.author.value,
                message: event.target.message.value,
            }),
        })
            .then((response) => {
                if (response.status >= 400 && response.status < 600) {
                    throw new Error("Bad response from server");
                }
                return response;
            })
            .then((returnedResponse) => {
                // Your response to manipulate
                setIsSubmitSuccessful(true);
                setIsSubmitting(false);
                console.log("sugestão adicionada.");
            }).catch((error) => {
                // Your error is here!
                setIsSubmitSuccessful(false);
                setIsSubmitting(false);
                console.log(error);
            });
    };

    const closingModal = () => {
        setIsSubmitSuccessful(false);
        setIsSubmitting(false);
        onClose();
    }

    return (
        <Box my={6}>
            <Button onClick={onOpen} colorScheme="red">
                Sugerir um livro
            </Button>
            <Modal isOpen={isOpen} onClose={closingModal} motionPreset="slideInBottom">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Sugestão de leitura</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={4}>
                        <form onSubmit={submitSuggestion}>
                            <FormControl id="title" mt={2}>
                                <FormLabel>Nome do Livro</FormLabel>
                                <Input type="title" isRequired={true}/>
                                <FormHelperText>...</FormHelperText>
                            </FormControl>
                            <FormControl id="message" mt={2}>
                                <FormLabel>Mensagem</FormLabel>
                                <Input type="message"/>
                                <FormHelperText>Se quiser mandar um link, ou me dizer o que gostou do
                                    livro.</FormHelperText>
                            </FormControl>
                            <FormControl id="author" mt={2}>
                                <FormLabel>Seu nome</FormLabel>
                                <Input type="author"/>
                                <FormHelperText>Me diz seu nome.</FormHelperText>
                            </FormControl>
                            {isSubmitSuccessful ? (
                                <Alert status="success" rounded="xl">
                                    <AlertIcon/>
                                    Obrigado pela sugestão!
                                </Alert>
                            ) : (
                                <Button
                                    type="submit"
                                    mt={4}
                                    colorScheme="blue"
                                    w="100%"
                                    isLoading={isSubmitting}
                                    leftIcon={<FiMessageCircle size={18}/>}
                                >
                                    Confirmar sugestão
                                </Button>
                            )}
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default BookSuggestion;