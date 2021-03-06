# Shell script to create react component
# Accepts 1 argument: name of component
# Creates 2 files in src/components: [component name].js and [component name].css,
# with some boilerplate code

# Make components folder if it doesn't exist
if [ ! -d "./src/components" ] 
then
    mkdir "./src/components" 
fi

# Make component files
name=$1
cd "./src/components"
touch "$name.tsx"

# Write boilerplate code to ts file
echo "import React from 'react';
import { Box } from '@chakra-ui/react';

interface Props {
	
}

function $1(props: Props) {
	return (
		<Box>

		</Box>
	)
}

export default $1;" >> "$1.tsx"

