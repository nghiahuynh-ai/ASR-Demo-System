FROM ubuntu:20.04

MAINTAINER Nghia <nghia.huynhbachkhoa@hcmut.edu.vn>

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=Asia/Ho_Chi_Minh

RUN apt-get update && apt-get install -y --no-install-recommends locales git apt-utils && \
    apt-get -y install --no-install-recommends python3 python3-pip python3-dev build-essential && \  
    apt -y install make cmake gcc g++ ffmpeg && \  
    apt -y install libsndfile1-dev && \  
    pip3 install --upgrade pip && \  
    locale-gen en_US.UTF-8  && \  
    rm -rf /var/lib/apt/lists/*

RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \    
    locale-gen
    
ENV LANG en_US.UTF-8    
ENV LANGUAGE en_US:enENV LC_ALL en_US.UTF-8

RUN python3 -m pip install git+https://github.com/nghiahuynh-ai/Conformer-GM.git

COPY requirements.txt ./src/requirements.txt

RUN pip install -r ./src/requirements.txt && \
    rm -rf /root/.cache/pip

COPY . ./src/
EXPOSE 5000

WORKDIR /src/

CMD [ "python3", "app.py" ]