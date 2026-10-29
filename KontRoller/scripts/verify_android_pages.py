import json, struct, sys, zipfile
from pathlib import Path

artifact = Path(sys.argv[1])
errors = []
libraries = []
with zipfile.ZipFile(artifact) as archive:
    for entry in archive.infolist():
        if not entry.filename.endswith('.so'):
            continue
        binary = archive.read(entry)
        if binary[:4] != b'\x7fELF':
            errors.append(f'Not ELF: {entry.filename}')
            continue
        endian = '<' if binary[5] == 1 else '>'
        is64 = binary[4] == 2
        if is64:
            phoff = struct.unpack_from(endian + 'Q', binary, 32)[0]
            entsize, count = struct.unpack_from(endian + 'HH', binary, 54)
        else:
            phoff = struct.unpack_from(endian + 'I', binary, 28)[0]
            entsize, count = struct.unpack_from(endian + 'HH', binary, 42)
        alignments = []
        for index in range(count):
            offset = phoff + index * entsize
            if struct.unpack_from(endian + 'I', binary, offset)[0] == 1:
                alignments.append(struct.unpack_from(endian + ('Q' if is64 else 'I'), binary, offset + (48 if is64 else 28))[0])
        if not alignments:
            errors.append(f'No LOAD segments: {entry.filename}')
        if is64 and any(value < 16384 for value in alignments):
            errors.append(f'64-bit ELF alignment is below 16 KB: {entry.filename}: {alignments}')
        zip_offset = None
        if artifact.suffix == '.apk' and entry.compress_type == zipfile.ZIP_STORED:
            archive.fp.seek(entry.header_offset)
            header = archive.fp.read(30)
            name_len, extra_len = struct.unpack_from('<HH', header, 26)
            zip_offset = entry.header_offset + 30 + name_len + extra_len
            if is64 and zip_offset % 16384:
                errors.append(f'64-bit ZIP data is not 16 KB aligned: {entry.filename}')
        libraries.append({'library': entry.filename, 'elf_bits': 64 if is64 else 32, 'load_alignments': alignments, 'zip_data_offset': zip_offset})
if not any(lib['elf_bits'] == 64 for lib in libraries):
    errors.append('No 64-bit native libraries found')
report = {'artifact': str(artifact), 'native_library_count': len(libraries), 'passed': not errors, 'errors': errors, 'libraries': libraries}
print(json.dumps(report, indent=2))
if len(sys.argv) > 2:
    Path(sys.argv[2]).write_text(json.dumps(report, indent=2), encoding='utf-8')
sys.exit(bool(errors))
