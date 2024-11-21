import { Button, Flex, Text } from '@chakra-ui/react';
import { CustomButton } from './button';

export const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage < 3) {
                pageNumbers.push(1, 2, 3, '...', totalPages);
            } else if (currentPage > totalPages - 2) {
                pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pageNumbers;
    };

    const handleClick = (pageNumber) => {
        if (pageNumber === '...') return;
        onPageChange(pageNumber);
    };

    if (totalPages < 2) {
        return null
    }

    return (
        <Flex
            maxW={'fit-content'}
            mx={'auto'}
            justifyContent="center"
            alignItems="center"
            border={'1px solid'}
            borderColor={'theme.gray.300'}
            borderRadius={'4px'}
            height={'33px'}
        >
            <CustomButton
                isDisabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
                rounded={'0%'}
                bg='transparent'
                color="theme.gray.300"
                height={'100%'}
                text={'Previous'}
                fontSize='14px'
                width={'83px'}
                borderRight={'1px solid'}
                borderColor={'theme.gray.300'}
            />

            {getPageNumbers().map((pageNumber, index) => (
                <Button
                    rounded={'0%'}
                    key={index}
                    onClick={() => handleClick(pageNumber)}
                    color={currentPage === pageNumber ? 'white' : 'theme.gray.300'}
                    bg={currentPage === pageNumber ? '#50B7F0' : 'transparent'}
                    isDisabled={pageNumber === '...'}
                    px={4}
                    height={'100%'}
                    minW={'32px'}
                    borderRight={'1px solid'}
                    borderColor={'theme.gray.300'}
                >
                    {pageNumber === '...' ? <Text as="span" color="theme.gray.500">...</Text> : pageNumber}
                </Button>
            ))}

            <CustomButton
                rounded={'0%'}
                isDisabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
                bg='transparent'
                color="theme.gray.300"
                height={'100%'}
                width={'55px'}
                fontSize='14px'
                text={'Next'}
            />
        </Flex>
    );
};