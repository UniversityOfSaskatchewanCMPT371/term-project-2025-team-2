FROM node:23-bullseye

WORKDIR /app

# playwright dependencies
RUN npx playwright install-deps

# install playwright
RUN npx playwright install

# enter with bash, so we can run commands ie npm install, 
# use npm run dev to start dev server
ENTRYPOINT ["/bin/sh", "-c", "bash"]
