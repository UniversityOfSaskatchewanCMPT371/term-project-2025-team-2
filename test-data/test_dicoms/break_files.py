'''
This script reads a DICOM file, modifies it, and writes the modified data to a new file.
- can be used to create broken files for testing
'''

with open('gen_dicom_files/test_dicom_0.dcm', 'rb') as f:
    data = bytearray(f.read())
    print(f"Read {len(data)} bytes")
    
    def get_ascii(byte):
        if 32 <= byte <= 126: 
            return chr(byte)
        return '.'
    
    def print_hexdump(start_offset, length=128):
        end = min(start_offset + length, len(data))
        
        for i in range(start_offset, end, 16):

            bytes_this_line = min(16, end - i)
            
            line = f"{i:08x}:  "
            
            for j in range(bytes_this_line):
                line += f"{data[i+j]:03} "
                
                if j == 7:
                    line += " "
            
            if bytes_this_line < 16:
                padding = '   ' * (16 - bytes_this_line)
                if bytes_this_line <= 8:
                    padding += ' '
                line += padding
            
            line += " |"
            for j in range(bytes_this_line):
                line += get_ascii(data[i+j])
            line += "|"
            
            print(line)
    
    if len(data) > 700:
        print("\nBytes around position 700:")
        print_hexdump(max(0, 700 - (700 % 16)))



def write_bytes_to_file(byte_data, output_file_path):
    """
    Write a byte array to a file
    
    Args:
        byte_data (bytes or bytearray): The byte data to write
        output_file_path (str): Path to the output file
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        with open(output_file_path, 'wb') as f:
            f.write(byte_data)
        print(f"Successfully wrote {len(byte_data)} bytes to {output_file_path}")
        return True
    except Exception as e:
        print(f"Error writing to file {output_file_path}: {e}")
        return False

# Write to a new file
output_file = 'gen_dicom_files/broken_files/modified_dicom_0.dcm'

# Remove byte 700, break file
data = data[:700] + data[699:]
write_bytes_to_file(data, output_file)


