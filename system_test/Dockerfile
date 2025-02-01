FROM python:3.12-bookworm

RUN pip install playwright && \
    playwright install --with-deps

ENTRYPOINT ["/bin/bash"]

